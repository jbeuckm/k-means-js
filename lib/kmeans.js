/*
 * K-Means clustering toolbox
 */


/**
 * Move each mean to the average position of its assigned points.
 *
 * @param points
 * @param assignments
 * @param means
 */
exports.moveMeansToCenters = function(points, assignments, means) {

  if (points.length != assignments.length) {
    throw("points and assignments arrays must be of same dimension");
  }

  for (var i=0, l=means.length; i<l; i++) {

    // find assigned points for this mean
    var assignedPoints = [];
    for (var j= 0, m=assignments.length; j<m; j++) {
      if (assignments[j] == i) {
        assignedPoints.push(points[j]);
      }
    }

    means[i] = exports.averagePosition(assignedPoints);
  }

  return means;
};


/**
 *
 * @param points
 */
exports.averagePosition = function(points) {

  var sums = points[0].slice(0);

  var pointCount = points.length;

  for (var i= 1; i<pointCount; i++) {
    var point = points[i];
    for (var j= 0, m=point.length; j<m; j++) {
      sums[j] += point[j];
    }
  }

  for (var k=0, n=sums.length; k<n; k++) {
    sums[k] /= pointCount;
  }

  return sums;
};

/**
 * Count how many of the assignments have changed during the cycle.
 *
 * @param oldAssignments
 * @param newAssignments
 */
exports.countChangedAssignments = function(oldAssignments, newAssignments) {

  if (oldAssignments.length != newAssignments.length) {
    throw("old and new assignment arrays must be of same dimension");
  }

  var count = 0;
  for (var i= 0, l=oldAssignments.length; i<l; i++) {
    if (oldAssignments[i] != newAssignments[i]) {
      count++;
    }
  }

  return count;
};


/**
 * Return an array of closest mean index for each point.
 */
exports.assignPointsToMeans = function(points, means) {
  var assignments = [];

  for (var i=0, l=points.length; i<l; i++) {
    assignments.push(exports.findClosestMean(points[i], means));
  }

  return assignments;
};




/**
 * Calculate the distance to each mean, then return the index of the closest.
 *
 * @param point
 * @param means
 */
exports.findClosestMean = function(point, means) {
  var distances = [];
  for (var i=0, l=means.length; i<l; i++) {
    distances.push(exports.distance(point, means[i]));
  }
  return exports.findIndexOfMinimum(distances);
};


/**
 * Return the index of the smallest value in the array.
 * @param array
 * @return {Number}
 */
exports.findIndexOfMinimum = function(array) {

  var min = array[0], index = 0;

  for (i=1, l=array.length; i<l; i++) {
    if(array[i] < min) {
      index = i;
      min = array[i];
    }
  }

  return index;
};




/**
 * Generate k random datapoints.
 *
 * @param k
 */
exports.generateRandomPoints = function(ranges, k) {

  var dimensions = ranges.length;

  var means = [];
  for (var i=0; i<k; i++) {
    var mean = [];
    for (var d=0; d<dimensions; d++) {
      mean.push(ranges[d][0] + Math.random() * (ranges[d][1] - ranges[d][0]));
    }
    means.push(mean);
  }

  return means;
};

/**
 * Calculate the ranges for each dimension
 *
 * @param dataPoints {Array} An array of same-length data arrays, eg. [ [0,2,7], [6,2,3] ]
 */
exports.findRanges = function(dataPoints) {

  var firstPoint = dataPoints[0];

  var pointCount = dataPoints.length;
  var dimensions = firstPoint.length;

  var ranges = [];
  for (var d=0; d<dimensions; d++) {
    ranges[d] = [firstPoint[d], firstPoint[d]];
  }

  for (var pointIndex=1; pointIndex<pointCount; pointIndex++) {

    var testPoint = dataPoints[pointIndex];

    for (var d=0; d<dimensions; d++) {

      if (testPoint[d] < ranges[d][0]) {
        ranges[d][0] = testPoint[d];
      }
      if (testPoint[d] > ranges[d][1]) {
        ranges[d][1] = testPoint[d];
      }
    }
  }

  return ranges;
};


/**
 * Euclidean distance between two points in arbitrary dimension
 */
exports.distance = function(point1, point2) {

  if (point1.length != point2.length) {
    throw("point1 and point2 must be of same dimension");
  }

  var dim = point1.length;
  var sum = 0;
  for (var i=0; i<dim; i++) {
    sum += (point1[i] - point2[i]) * (point1[i] - point2[i]);
  }

  return Math.sqrt(sum);
};


