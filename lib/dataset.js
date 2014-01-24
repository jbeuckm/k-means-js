/*
 * Normalize a set of data objects for K-Means analysis
 *
 * @param {object} params - Types for non-linear fields (by label)
 * @param {array} data - Array of labeled vectors to be normalized
 *
 */
exports.findRanges = function(params, data) {

    // store min/max for regular fields
    var minima = {};
    var maxima = {};

    // every possible value for discrete fields
    var discreteValues = {};

    for (var i=0, l=data.length; i<l; i++) {
        var datum = data[i];
        for (var label in datum) {
            switch (params[label]) {

                // collect unique values for this field
                case "discrete":
                    if (!discreteValues.hasOwnProperty(label)) {
                        discreteValues[label] = [];
                    }
                    var values = discreteValues[label];
                    if (values.indexOf(datum[label]) == -1) {
                        values.push(datum[label]);
                    }
                    break;

                default:
                    if (!minima.hasOwnProperty(label)) {
                        minima[label] = Number.MAX_VALUE;
                        maxima[label] = Number.MIN_VALUE;
                    }

                    if (datum[label] > maxima[label]) {
                        maxima[label] = datum[label];
                    }
                    if (datum[label] < minima[label]) {
                        minima[label] = datum[label];
                    }
                    break;
            }
        }
    }

    return {
        minima: minima,
        maxima: maxima,
        discreteValues: discreteValues
    }
};

