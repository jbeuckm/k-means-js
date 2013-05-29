var kmeans = require('./lib/kmeans');

var ranges = [
  [0, 100],
  [0, 100],
  [0, 100]
];

var points = kmeans.generateRandomPoints(ranges, 1000);

var means = kmeans.algorithm(points, 50, console.log);

console.log(means);
