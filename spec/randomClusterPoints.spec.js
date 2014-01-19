

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

  it("picks a random number within a range", function() {

    var component = rcp.genrand(0, 1, 0, 1, 1);

    if (component != 0) {
      expect(component).toBeGreaterThan(0);
    }

    expect(component).toBeLessThan(1);
  });

  it("generates a point", function() {
      var point = rcp.generatePoint();

    expect(point.length).not.toBeNull();
    expect(point.length).toEqual(3);
  });

});
