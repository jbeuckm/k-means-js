describe("Find best value of K", function() {

  var pbk = require('../lib/phamBestK');

  it("finds cluster distortions", function() {

    var points = [[1,1],[2,2]];
    var means = [[0,0]];
    var assignments = [0,0];

    expect(pbk.clusterDistortions(points, means, assignments)).toEqual({0:10});
    expect(pbk.totalDistortion(points, means, assignments)).toEqual(10);
  });


  it("calculates alpha", function(){

    var means = [[0,0]];

    function badK() {
      return pbk.alpha_K(means, 1);
    }

    expect(badK).toThrow();

    means.push([1,1]);

    expect(pbk.alpha_K(means, 1)).toEqual(1-3/8);

    means.push([2,2]);

    expect(pbk.alpha_K(means, 2)).toEqual(2 + (1-2)/6);


  });


});
