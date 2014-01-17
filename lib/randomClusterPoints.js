// from http://4e.iwp9.org/papers/lumpyrng.pdf

function genrand(bmin, bmax, rmin, rmax, n) {
// Generalized random number generator;
// sum of n random variables (usually 3).
// Bell curve spans bmin<=x<bmax; then,
// values outside rmin<=x<rmax are rejected.
    var i, u, sum;
    do {
        sum = 0;

        for (i = 0; i < n; i++) {
            sum += bmin + (Math.rand() * Number.MAX_VALUE % (bmax - bmin));
        }

        if (sum < 0) sum -= n - 1;
        /* prevent pileup at 0 */
        u = sum / n;

    } while (!(rmin <= u && u < rmax));

    return u;
}


var clusterCurveDescriptions;

exports.init = function(ranges, count, _maxClusterPortion) {

    var maxClusterPortion = _maxClusterPortion || 1/count;

    clusterCurveDescriptions = [];

    for (var i=0; i<count; i++) {

        var ccd = generateClusterCurveDescriptions(ranges, maxClusterPortion);

        clusterCurveDescriptions.push(ccd)
    }

    return clusterCurveDescriptions;
};


/*
 * Generate bell curve descriptions in each dimension (within range) to define a cluster probability
 *
 */
function generateClusterCurveDescriptions(ranges, maxClusterPortion) {

    curveDescriptions = [];

    for (var i=0; i<ranges.length; i++) {

        var range = ranges[i];
        var rangeSize = range[1] - range[0];

        var center = range[0] + Math.random() * rangeSize;
        var width = Math.random * rangeSize * maxClusterPortion;

        var curveDescription = {
            bmin: center - width/2,
            bmax: center + width/2,
            rmin: center - width/2,
            rmax: center + width/2,
            height: 3
        };

        curveDescriptions.push(curveDescription);
    }

    return curveDescriptions;
}



function generatePoint() {

    if (!clusterCurveDescriptions) { return null; }

}

exports.generateClusterCurveDescriptions = generateClusterCurveDescriptions;
exports.genrand = genrand;
exports.generatePoint = generatePoint;