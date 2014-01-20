describe("Find best value of K", function() {

  var pbk = require('../lib/phamBestK');
  var kmeans = require('../lib/kmeans');
  var points;

  beforeEach(function(){

    function bell(center, width) {
      var a = center + width * (-.5 + Math.random());
      var b = center + width * (-.5 + Math.random());
      var c = center + width * (-.5 + Math.random());
      return (a + b + c) / 3;
    }

    // three obvious clusters
    points = [];
    for (var i=0; i<10; i++) {
      points.push([
        bell(10,.5),
        bell(0,.5),
        bell(0,.5)
      ]);
      points.push([
        bell(0,.5),
        bell(10,.5),
        bell(0,.5)
      ]);
      points.push([
        bell(0,.5),
        bell(0,.5),
        bell(10,.5)
      ]);
    }

  });

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

    expect(bestK).toBeGreaterThan(1);
    expect(bestK).toBeLessThan(10);
  });


  it("estimates the best value for K", function(){

    var bestK = pbk.findBestK(points, 10);
    expect(bestK.K).toBeGreaterThan(1);
    expect(bestK.K).toBeLessThan(10);

    console.log(bestK.means);
    expect(bestK.means.length).toEqual(bestK.K);

  });

});
