/*
 * Normalize a set of data objects for K-Means analysis
 *
 * @param {object} params - Types for non-linear fields (by label)
 * @param {array} data - Array of labeled vectors to be normalized
 *
 */
function normalize(params, data) {

    // store min/max for regular fields
    var minima = {};
    var maxima = {};

    // every possible value for discrete fields
    var discreteValues = {};

    for (var i=0, l=data.length; i<l; i++) {
        var datum = data[i];
        for (var label in datum) {
            switch (params[label]) {

                case "discrete":
                    break;

                default:
                    break;
            }
        }
    }
}
