/*
 * K-Means clustering toolbox
 */


/**
 * Find the average distance between the means.
 * @param means
 * @return {Number}
 */
exports.findAverageMeanSeparation = function(means) {

    var sum = 0, count = 0;
    var l = means.length;

    for (var i=0; i<l; i++) {
        for (var j=0; j<l; j++) {
            sum += exports.distance(means[i].vector, means[j].vector);
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
exports.findAverageDistancePointToMean = function(points, means, assignments) {

    if (pointsç.length != assignments.length) {
        throw("points and assignments arrays must be of same dimension");
    }

    var sum = 0;
    var count = points.vector.length;
    for (var i=0; i<count; i++) {
        var mean = means[assignments[i]].vector;
        sum += exports.distance(points[i].vector, mean);
    }
    return sum / count;
};



/**
 * Count assigned points for each mean (index)
 * @param assignments
 * @return {Object}
 */
exports.countPointsPerMean = function(assignments) {
    var counts = {};

    for (var i= 0, l=assignments.length; i<l; i++) {
        var a = assignments[i];

        if (!counts[a]) {
            counts[a] = 1;
        }
        else {
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
exports.algorithm = function(points, k, progress) {

  var ranges = exports.findRanges(points);

  var means = exports.generateRandomPoints(ranges, k);

  var oldAssignments, assignments = exports.assignPointsToMeans(points, means);

  var n = 0, changeCount;

  do {

    exports.moveMeansToCenters(points, assignments, means);

    oldAssignments = assignments;

    assignments = exports.assignPointsToMeans(points, means);

    changeCount = exports.countChangedAssignments(assignments, oldAssignments);

    if (progress) {
      progress(changeCount, n);
    }

    n++;

  } while (changeCount > 0);

  return means;
};



/**
 * Move each mean to the average position of its assigned points.
 *
 * @param points
 * @param assignments
 * @param means
 * @return {Array}
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
        assignedPoints.push(points[j].vector);
      }
    }

    means[i].vector = exports.averagePosition(assignedPoints);
  }

  return means;
};


/**
 * Find the average location of a given set of points.
 *
 * @param points
 * @return {Array}
 */
exports.averagePosition = function(points) {

  var sums = points[0].vector.slice(0);

  var pointCount = points.length;

  for (var i= 1; i<pointCount; i++) {
    var point = points[i].vector;
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
 * @return {Number}
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
 * @return {Array}
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
 * @return {Number}
 */
exports.findClosestMean = function(point, means) {
  var distances = [];
  for (var i=0, l=means.length; i<l; i++) {
    distances.push(exports.distance(point.vector, means[i].vector));
  }
  return exports.findIndexOfMinimum(distances);
};


/**
 * Return the index of the smallest value in the array.
 *
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
 * @return {Array}
 */
exports.generateRandomPoints = function(ranges, k) {

  var dimensions = ranges.length;

  var points = [];
  for (var i=0; i<k; i++) {
    var vector = [];
    for (var d=0; d<dimensions; d++) {
      vector.push(ranges[d][0] + Math.random() * (ranges[d][1] - ranges[d][0]));
    }
    points.push({vector:vector});
  }

  return points;
};

/**
 * Calculate the ranges for each dimension in the data
 *
 * @param dataPoints {Array} An array of same-length data arrays, eg. [ [0,2,7], [6,2,3] ]
 * @return {Array}
 */
exports.findRanges = function(dataPoints) {

  var firstPoint = dataPoints[0].vector;

  var pointCount = dataPoints.length;
  var dimensions = firstPoint.length;

  var ranges = [];
  for (var d=0; d<dimensions; d++) {
    ranges[d] = [firstPoint[d], firstPoint[d]];
  }

  for (var pointIndex=1; pointIndex<pointCount; pointIndex++) {

    var testPoint = dataPoints[pointIndex].vector;

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
 * @return {Number}
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


