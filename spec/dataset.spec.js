
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

    it("finds data ranges", function() {

        var ranges = dataset.findRanges(params, data);

        console.log(ranges);

    });

});
