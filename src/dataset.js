/*
 *
 * Find normalizing parameters for a given data set.
 *
 * @param {object} params - Types for non-linear fields (by label)
 * @param {array} data - Array of labeled vectors to be normalized
 *
 */
const findRanges = function (params, data) {
  const ranges = {};

  for (let i = 0, l = data.length; i < l; i++) {
    const datum = data[i];
    for (const label in datum) {
      if (!ranges.hasOwnProperty(label)) {
        const newField = {
          type: params[label] || "linear",
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

      const fieldRange = ranges[label];

      const fieldValue = datum[label];

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

  for (const i in ranges) {
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
const normalize = function (data, ranges, weights = {}) {
  const normalizedData = [];

  for (let i = 0, l = data.length; i < l; i++) {
    const datum = data[i];

    const normalizedDatum = [];

    for (const label in datum) {
      const fieldValue = datum[label];
      const range = ranges[label];

      const weight = weights[label] || 1;

      switch (range.type) {
        case "discrete":
          // generate a binary vector indicating category of this data
          for (let j = 0, k = range.values.length; j < k; j++) {
            if (range.values[j] == fieldValue) {
              normalizedDatum.push(weight);
            } else {
              normalizedDatum.push(0);
            }
          }
          break;

        case "linear":
          normalizedDatum.push(
            ((fieldValue - range.min) / range.range) * weight
          );
          break;
      }
    }

    normalizedData.push(normalizedDatum);
  }

  return normalizedData;
};

const denormalizeDatum = function (normalizedDatum, ranges) {
  const denorm = {};

  let vectorPosition = 0;

  for (const i in ranges) {
    const normalizedField = normalizedDatum[vectorPosition];
    const range = ranges[i];

    let denormalizedValue;

    switch (range.type) {
      // choose the most strongly represented category for a discrete field
      case "discrete":
        const subVectorLength = range.values.length;
        const fieldSubVector = normalizedDatum.slice(
          vectorPosition,
          vectorPosition + subVectorLength
        );

        let max_index = -1;
        let max_value = Number.MIN_VALUE;
        for (var j = 0; j < subVectorLength; j++) {
          if (fieldSubVector[j] > max_value) {
            max_value = fieldSubVector[j];
            max_index = j;
          }
        }

        denormalizedValue = range.values[max_index];
        vectorPosition += subVectorLength;

        break;

      // simply scale back into the original range
      case "linear":
        denormalizedValue = range.min + normalizedField * range.range;
        vectorPosition += 1;
        break;
    }

    denorm[i] = denormalizedValue;
  }

  return denorm;
};

export default {
  normalize,
  findRanges,
  denormalizeDatum,
};
