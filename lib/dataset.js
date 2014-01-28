/*
 *
 * Find normalizing parameters for a given data set.
 *
 * @param {object} params - Types for non-linear fields (by label)
 * @param {array} data - Array of labeled vectors to be normalized
 *
 */
exports.findRanges = function(params, data) {

    var ranges = {};

    for (var i=0, l=data.length; i<l; i++) {
        var datum = data[i];
        for (var label in datum) {

            if (!ranges.hasOwnProperty(label)) {

                var newField = {
                   type: params[label] || "linear"
                };

                switch (newField.type) {
                    case "discrete":
                        newField.values = [];
                        break;
                    case "linear":
                        newField.min = Number.MAX_VALUE;
                        newField.max = Number.MIN_VALUE;
                        break;
                }

                ranges[label] = newField;
            }

            var fieldRange = ranges[label];

            var fieldValue = datum[label];

            switch (fieldRange.type) {

                // collect unique values for this field
                case "discrete":
                    if (fieldRange.values.indexOf(fieldValue) == -1) {
                        fieldRange.values.push(fieldValue);
                    }
                    break;

                case "linear":
                    if (fieldValue > fieldRange.max) {
                        fieldRange.max = fieldValue;
                    }
                    if (fieldValue < fieldRange.min) {
                        fieldRange.min = fieldValue;
                    }
                    break;
            }
        }
    }

    for (var i in ranges) {
        switch (ranges[i].type) {
            case "linear":
                ranges[i].range = ranges[i].max - ranges[i].min;
                break;
        }
    }

    return ranges;
};


/*
 * Normalize a set of data objects for K-Means analysis
 */
exports.normalize = function(data, ranges) {

    var normalizedData = [];

    for (var i= 0, l=data.length; i<l; i++) {

        var datum = data[i];

        var normalizedDatum = [];

        for (var label in datum) {

            var fieldValue = datum[label];
            var range = ranges[label];

            switch (range.type) {

                case "discrete":
                    // generate a binary vector indicating category of this data
                    for (var j= 0, k=range.values.length; j<k; j++) {
                        if (range.values[j] == fieldValue) {
                            normalizedDatum.push(1);
                        }
                        else {
                            normalizedDatum.push(0);
                        }
                    }
                    break;

                case "linear":
                    normalizedDatum.push((fieldValue - range.min) / range.range);
                    break;
            }
        }

        normalizedData.push(normalizedDatum);
    }

    return normalizedData;
};


exports.denormalize = function(normalizedDatum, ranges) {

    var denorm = {};

    return denorm;
};

