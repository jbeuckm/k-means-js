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

    expect(pbk.alpha(means, 1)).toBeUndefined();

    means.push([1,1]);

    expect(pbk.alpha(means, 1)).toEqual(1-3/8);

    means.push([2,2]);

    expect(pbk.alpha(means, 2)).toEqual(2 + (1-2)/6);

  });


  it("calculates f(K)", function(){

    var kmeans = require('../lib/kmeans');

    function bell(center, width) {
      var a = center + width * (-.5 + Math.random());
      var b = center + width * (-.5 + Math.random());
      var c = center + width * (-.5 + Math.random());
      return (a + b + c) / 3;
    }

    // three obvious clusters
    var points = [];
    for (var i=0; i<10; i++) {
      points.push([
        bell(.95,.1),
        bell(.05,.1),
        bell(.05,.1)
      ]);
      points.push([
        bell(.05,.1),
        bell(.95,.1),
        bell(.05,.1)
      ]);
      points.push([
        bell(.05,.1),
        bell(.05,.1),
        bell(.95,.1)
      ]);
    }

    var result = {};
    var pham = {};
    var k = 1;

    result[k] = kmeans.algorithm(points, k);
    pham[k] = pbk.f(points, result[k].means, result[k].assignments);
    console.log(k+" => "+pham[k].f);
    expect(pham[k].f).toEqual(1);
    k++;

    while (k < 10) {
      result[k] = kmeans.algorithm(points, k);
      pham[k] = pbk.f(points, result[k].means, result[k].assignments, pham[k-1].alpha, pham[k-1].distortion);
      console.log(k+" => "+pham[k].f);
      k++;
    }

    var bestK;
    var minF = Number.MAX_VALUE;
    for (var i in pham) {
      if (pham[i].f < minF) {
        minF = pham[i].f;
        bestK = pham[i].K;
      }
    }

    expect(bestK).toEqual(3);

    expect(pbk.findBestK(points, 10).bestK).toEqual(3);

  });

});
