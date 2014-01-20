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
    throw ("alpha is undefined for k="+K+" and dim="+N_dim);
  }

  if (K == 2) {
    return 1 - 3/(4 * N_dim);
  }
  else {
    return alpha_K_minus_1 + (1 - alpha_K_minus_1) / 6;
  }

};


exports.f = function(points, means, assignments, distortion_k_minus_1) {

  var K = means.length;

  if (K == 1) {
    return 1;
  }
  if (distortion_k_minus_1 == 0) {
    return 1;
  }

};
