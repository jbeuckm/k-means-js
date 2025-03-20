const kmeans = require("./dist/main").default;

const ranges = [
  [0, 100],
  [0, 100],
  [0, 100],
];

const points = kmeans.generateRandomPoints(ranges, 1000);

const means = kmeans.cluster(points, 50, console.log);

console.log(means);
