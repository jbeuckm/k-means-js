import kmeans from "./kmeans";

/*
 * Implement the optimal K-finding algorithm described by Pham, et al
 * http://www.ee.columbia.edu/~dpwe/papers/PhamDN05-kmeans.pdf
 */

const squaredError = (point1, point2) => {
  if (point1.length != point2.length) {
    throw "point1 and point2 must be of same dimension";
  }

  var dim = point1.length;
  var sum = 0;
  for (var i = 0; i < dim; i++) {
    sum += (point1[i] - point2[i]) * (point1[i] - point2[i]);
  }

  return sum;
};

const clusterDistortions = (points, means, assignments) => {
  var distortions = {};

  for (var i = 0, l = points.length; i < l; i++) {
    var meanIndex = assignments[i];

    if (!distortions.hasOwnProperty(meanIndex)) {
      distortions[meanIndex] = 0;
    }
    distortions[meanIndex] += squaredError(points[i], means[meanIndex]);
  }

  return distortions;
};

const totalDistortion = (points, means, assignments) => {
  var distortions = clusterDistortions(points, means, assignments);

  var sum = 0;
  for (var i in distortions) {
    sum += distortions[i];
  }

  return sum;
};

const alpha = (means, alpha_K_minus_1) => {
  var N_dim = means[0].length;
  var K = means.length;

  if (K < 2 || N_dim <= 1) {
    return undefined;
  }
  if (K == 2) {
    return 1 - 3 / (4 * N_dim);
  } else {
    return alpha_K_minus_1 + (1 - alpha_K_minus_1) / 6;
  }
};

const f = (
  points,
  means,
  assignments,
  alpha_K_minus_1,
  distortion_K_minus_1
) => {
  var K = means.length;

  var distortion = totalDistortion(points, means, assignments);
  var _alpha = alpha(means, alpha_K_minus_1);

  var f;

  if (K == 1 || distortion_K_minus_1 == 0) {
    f = 1;
  } else {
    f = distortion / (_alpha * distortion_K_minus_1);
  }

  return {
    K: K,
    distortion: distortion,
    alpha: _alpha,
    f: f
  };
};

const findBestK = (points, testLimit, progress) => {
  var result = {};
  var pham = {};
  var k = 1;

  result[k] = kmeans.cluster(points, k);
  pham[k] = f(points, result[k].means, result[k].assignments);
  console.log(k + " => " + pham[k].f);
  k++;

  while (k < testLimit) {
    result[k] = kmeans.cluster(points, k);
    var newPham = f(
      points,
      result[k].means,
      result[k].assignments,
      pham[k - 1].alpha,
      pham[k - 1].distortion
    );

    if (progress) {
      progress({
        K: newPham.K,
        f: newPham.f
      });
    }

    pham[k] = newPham;

    console.log(k + " => " + pham[k].f);
    k++;
  }

  var bestK;
  var minF = Number.MAX_VALUE;
  var _f = {};
  var bestMeans;

  for (var i in pham) {
    var pham_i = pham[i];
    _f[i] = pham_i.f;

    if (pham_i.f < minF) {
      minF = pham_i.f;
      bestK = pham_i.K;
      bestMeans = result[i].means;
    }
  }

  return {
    f: _f,
    K: bestK,
    means: bestMeans
  };
};

export default {
  findBestK,
  f,
  clusterDistortions,
  alpha,
  totalDistortion
};
