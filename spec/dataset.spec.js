
var dataset = require('../lib/dataset');

describe("Dataset", function() {

    var data = [
        {
            category: 1,
            value: 1
        },
        {
            category: 2,
            value: 50
        },
        {
            category: 1,
            value: 100
        },
        {
            category: 1,
            value: 75
        }
    ];

    var params = {
        category: "discrete"
    };

    var ranges;

    it("finds data ranges", function() {

        ranges = dataset.findRanges(params, data);

        expect(ranges["category"].type).toEqual("discrete");
        expect(ranges["category"].values.length).toEqual(2);

        expect(ranges["value"].type).toEqual("linear");
        expect(ranges["value"].min).toEqual(1);
        expect(ranges["value"].max).toEqual(100);
    });

    it("normalizes data", function() {

        normalized = dataset.normalize(data, ranges);

        expect(normalized.length).toEqual(data.length);

    });

});
