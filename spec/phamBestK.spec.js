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
      return pbk.alpha(means, 1);
    }

    expect(badK).toThrow();

    means.push([1,1]);

    expect(pbk.alpha(means, 1)).toEqual(1-3/8);

    means.push([2,2]);

    expect(pbk.alpha(means, 2)).toEqual(2 + (1-2)/6);


  });


  it("calculates f(K)", function(){

    // two obvious clusters
    var points = [ [0,0],[0,1],[1,0], [9,10],[10,9],[10,10] ];
    var means = [[0,0]];
    var assignments = [0,1];

    var f_1 = pbk.f(points, means, assignments);

    expect(f_1).toEqual(1);

  });

});
