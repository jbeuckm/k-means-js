K-Means Clustering
==================

A basic Javascript implementation of the [cluster analysis] [1] algorithm.

  [1]: http://en.wikipedia.org/wiki/K-means_clustering "wikipedia article"

Usage
-----
```javascript
var points = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

var means = require('kmeans').algorithm(points, 2, console.log);
```

The call to algorithm() will find the data's range in each dimension, generate k=2 random points, and iterate until the means are static.

Todo
----

