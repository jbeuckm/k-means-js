
var kmeans = require('../lib/kmeans');

describe("KMeans", function() {

  var data = [ [0,1,2], [3,4,5], [6,7,8] ];

  it("should find ranges in a data array", function() {

    var ranges = kmeans.findRanges(data);

    expect(ranges).toEqual([ [0,6], [1,7], [2,8] ]);

  });


  it("should create K random means within range", function() {

    var ranges = kmeans.findRanges(data);
    var dimensions = ranges.length;

    var means = kmeans.generateRandomPoints(ranges, 2);

    expect(means.length).toEqual(2);

    for (var i=0; i<2; i++) {
      var mean = means[i];

      expect(mean.length).toBeDefined();

      for (var d=0; d<dimensions; d++) {

        expect(mean[d]).not.toBeLessThan(ranges[d][0]);
        expect(mean[d]).not.toBeGreaterThan(ranges[d][1]);
      }
    }

  });


  it("calculates Euclidean distance between two points", function() {

    var point1 = [0,0,0], point2 = [3,4,0];

    expect(kmeans.distance(point1, point2)).toEqual(5);

  });

});
