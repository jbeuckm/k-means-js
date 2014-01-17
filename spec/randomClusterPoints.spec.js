
var rcp = require('../lib/randomClusterPoints');

describe("Random Cluster Points", function() {

    it("generates bell curve descriptions for each dimension", function() {

        var ranges = [[0,1],[2,3],[4,5]];

        var curves = rcp.init(ranges, 3);

        expect(curves.length).toEqual(3);
    });

});
