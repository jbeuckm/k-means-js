/*
 * K-Means clustering toolbox
 */


/**
 * Generate k random datapoints.
 *
 * @param k
 */
exports.generateRandomMeans = function(ranges, k) {

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
