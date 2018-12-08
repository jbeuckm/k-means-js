import randomClusterPoints from "./randomClusterPoints";

/**
 * Find the average distance between the means.
 * @param means
 * @return {Number}
 */
const findAverageMeanSeparation = means => {
  var sum = 0,
    count = 0;
  var l = means.length;

  for (var i = 0; i < l - 1; i++) {
    for (var j = i + 1; j < l; j++) {
      sum += distance(means[i], means[j]);
      count++;
    }
  }

  return sum / count;
};

/**
 * Find average distance of a point from its mean
 *
 * @param assignments
 * @return {Object}
 */
const findAverageDistancePointToMean = (points, means, assignments) => {
  if (points.length != assignments.length) {
    throw "points and assignments arrays must be of same dimension";
  }

  var sum = 0;
  var count = points.length;
  for (var i = 0; i < count; i++) {
    var mean = means[assignments[i]];
    sum += distance(points[i], mean);
  }
  return sum / count;
};

/**
 * Count assigned points for each mean (index)
 * @param assignments
 * @return {Object}
 */
const countPointsPerMean = assignments => {
  var counts = {};

  for (var i = 0, l = assignments.length; i < l; i++) {
    var a = assignments[i];

    if (!counts[a]) {
      counts[a] = 1;
    } else {
      counts[a]++;
    }
  }

  return counts;
};

/**
 * Run the basic algorithm, classifying the given points into k groups.
 *
 * @param points
 * @param k
 * @param progress callback to report progress of the training
 * @return {Array}
 */
const algorithm = (points, k, progress) => {
  // select k of the points as initial means
  var means = [];
  for (var i = 0; i < k; i++) {
    var index = Math.floor(Math.random() * points.length);
    var point = points[index];
    means.push(point.slice(0));
  }

  let oldAssignments,
    assignments = assignPointsToMeans(points, means);

  let n = 0,
    changeCount;

  do {
    moveMeansToCenters(points, assignments, means);

    oldAssignments = assignments;

    assignments = assignPointsToMeans(points, means);

    changeCount = countChangedAssignments(assignments, oldAssignments);

    if (progress) {
      progress(changeCount, n);
    }

    n++;
  } while (changeCount > 0);

  return {
    means: means,
    assignments: assignments,
    steps: n
  };
};

/**
 * Move each mean to the average position of its assigned points.
 *
 * @param points
 * @param assignments
 * @param means
 * @return {Array}
 */
const moveMeansToCenters = function(points, assignments, means) {
  if (points.length != assignments.length) {
    throw "points and assignments arrays must be of same dimension";
  }

  for (var i = 0, l = means.length; i < l; i++) {
    // find assigned points for this mean
    var assignedPoints = [];
    for (var j = 0, m = assignments.length; j < m; j++) {
      if (assignments[j] == i) {
        assignedPoints.push(points[j]);
      }
    }

    if (assignedPoints.length > 0) means[i] = averagePosition(assignedPoints);
  }

  return means;
};

/**
 * Find the average location of a given set of points.
 *
 * @param points
 * @return {Array}
 */
const averagePosition = function(points) {
  var sums = points[0].slice(0);

  var pointCount = points.length;

  for (var i = 1; i < pointCount; i++) {
    var point = points[i];
    for (var j = 0, m = point.length; j < m; j++) {
      sums[j] += point[j];
    }
  }

  for (var k = 0, n = sums.length; k < n; k++) {
    sums[k] /= pointCount;
  }

  return sums;
};

/**
 * Count how many of the assignments have changed during the cycle.
 *
 * @param oldAssignments
 * @param newAssignments
 * @return {Number}
 */
const countChangedAssignments = function(oldAssignments, newAssignments) {
  if (oldAssignments.length != newAssignments.length) {
    throw "old and new assignment arrays must be of same dimension";
  }

  var count = 0;
  for (var i = 0, l = oldAssignments.length; i < l; i++) {
    if (oldAssignments[i] != newAssignments[i]) {
      count++;
    }
  }

  return count;
};

/**
 * Return an array of closest mean index for each point.
 * @return {Array}
 */
const assignPointsToMeans = function(points, means) {
  var assignments = [];

  for (var i = 0, l = points.length; i < l; i++) {
    assignments.push(findClosestMean(points[i], means));
  }

  return assignments;
};

/**
 * Calculate the distance to each mean, then return the index of the closest.
 *
 * @param point
 * @param means
 * @return {Number}
 */
const findClosestMean = function(point, means) {
  var distances = [];
  for (var i = 0, l = means.length; i < l; i++) {
    distances.push(distance(point, means[i]));
  }
  return findIndexOfMinimum(distances);
};

/**
 * Return the index of the smallest value in the array.
 *
 * @param array
 * @return {Number}
 */
const findIndexOfMinimum = function(array) {
  var min = array[0],
    index = 0;

  for (let i = 1, l = array.length; i < l; i++) {
    if (array[i] < min) {
      index = i;
      min = array[i];
    }
  }

  return index;
};

/**
 * Generate k random datapoints.
 *
 * @param n
 * @return {Array}
 */
const generateRandomPoints = function(ranges, n) {
  randomClusterPoints.init(ranges, 4, 1);

  var points = [];
  for (var i = 0; i < n; i++) {
    var mean = randomClusterPoints.generatePoint();
    points.push(mean);
  }

  return points;
};

/**
 * Calculate the ranges for each dimension in the data
 *
 * @param dataPoints {Array} An array of same-length data arrays, eg. [ [0,2,7], [6,2,3] ]
 * @return {Array}
 */
const findRanges = function(dataPoints) {
  var firstPoint = dataPoints[0];

  var pointCount = dataPoints.length;
  var dimensions = firstPoint.length;

  var ranges = [];
  for (var d = 0; d < dimensions; d++) {
    ranges[d] = [firstPoint[d], firstPoint[d]];
  }

  for (var pointIndex = 1; pointIndex < pointCount; pointIndex++) {
    var testPoint = dataPoints[pointIndex];

    for (var d = 0; d < dimensions; d++) {
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
 * @return {Number}
 */
const distance = (point1, point2) => {
  return Math.sqrt(squaredError(point1, point2));
};

/**
 * Useful for analyzing resulting clusters
 *
 * @param point1
 * @param point2
 * @return {Number}
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

/**
 * Sum the sum-squared error for all clusters - the function to be minimized
 *
 * @param assignments
 * @return {Object}
 */
const sumSquaredError = (points, means, assignments) => {
  if (points.length != assignments.length) {
    throw "points and assignments arrays must be of same dimension";
  }

  var sum = 0;
  var count = points.length;

  for (var i = 0; i < count; i++) {
    var mean = means[assignments[i]];
    sum += squaredError(points[i], mean);
  }

  return sum;
};

export default {
  averagePosition,
  algorithm,
  distance,
  findClosestMean,
  generateRandomPoints,
  findIndexOfMinimum,
  assignPointsToMeans,
  moveMeansToCenters,
  countChangedAssignments,
  findAverageMeanSeparation,
  findRanges,
  countPointsPerMean
};
