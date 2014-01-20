/*
 * Implement the optimal K-finding algorithm described by Pham, et al
 * http://www.ee.columbia.edu/~dpwe/papers/PhamDN05-kmeans.pdf
 */

exports.squaredError = function(point1, point2) {
  if (point1.length != point2.length) {
    throw("point1 and point2 must be of same dimension");
  }

  var dim = point1.length;
  var sum = 0;
  for (var i=0; i<dim; i++) {
    sum += (point1[i] - point2[i]) * (point1[i] - point2[i]);
  }

  return sum;
};


exports.clusterDistortions = function(points, means, assignments) {

  var distortions = {};

  for (var i= 0, l=points.length; i<l; i++) {
    var meanIndex = assignments[i];

    if (!distortions.hasOwnProperty(meanIndex)) {
      distortions[meanIndex] = 0;
    }
    distortions[meanIndex] += exports.squaredError(points[i], means[meanIndex]);
  }

  return distortions;
};

exports.totalDistortion = function(points, means, assignments) {

  var distortions = exports.clusterDistortions(points, means, assignments);

  var sum = 0;
  for (var i in distortions) {
    sum += distortions[i];
  }

  return sum;
};


exports.alpha = function(means, alpha_K_minus_1) {

  var N_dim = means[0].length;
  var K = means.length;

  if ((K < 2) || (N_dim <= 1)) {
    return undefined;
  }
  if (K == 2) {
    return 1 - 3/(4 * N_dim);
  }
  else {
    return alpha_K_minus_1 + (1 - alpha_K_minus_1) / 6;
  }

};


exports.f = function(points, means, assignments, alpha_K_minus_1, distortion_K_minus_1) {

  var K = means.length;

  var distortion = exports.totalDistortion(points, means, assignments);
  var alpha = exports.alpha(means, alpha_K_minus_1);

  var f;

  if ((K == 1) || (distortion_K_minus_1 == 0)) {
    f = 1;
  }
  else {
    f = distortion / (alpha * distortion_K_minus_1);
  }

  return {
    K: K,
    distortion: distortion,
    alpha: alpha,
    f: f
  };

};



exports.findBestK = function(points, testLimit) {

  var kmeans = require('../lib/kmeans');

  var result = {};
  var pham = {};
  var k = 1;

  result[k] = kmeans.algorithm(points, k);
  pham[k] = exports.f(points, result[k].means, result[k].assignments);
  console.log(k+" => "+pham[k].f);
  k++;

  while (k < testLimit) {
    result[k] = kmeans.algorithm(points, k);
    pham[k] = exports.f(points, result[k].means, result[k].assignments, pham[k-1].alpha, pham[k-1].distortion);
    console.log(k+" => "+pham[k].f);
    k++;
  }

  var bestK;
  var minF = Number.MAX_VALUE;
  var f = {};
  for (var i in pham) {

    var pham_i = pham[i];
    f[i] = pham_i.f;

    if (pham_i.f < minF) {
      minF = pham_i.f;
      bestK = pham_i.K;
    }
  }

  return {
    f: f,
    bestK: bestK
  };

};

