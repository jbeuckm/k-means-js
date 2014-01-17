

describe("Random Cluster Points", function() {

    var ranges = [[0,1],[2,3],[4,5]];
    var rcp = require('../lib/randomClusterPoints');

    beforeEach(function() {

        rcp.init(ranges, 3);
    });

    it("generates bell curve descriptions for each dimension", function() {

        var curves = rcp.init(ranges, 3);

        expect(curves.length).toEqual(3);
    });

    it("generates a point", function() {

        var point = rcp.generatePoint();

        expect(point.length).not.toBeNull();
    });

});
