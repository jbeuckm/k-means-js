# K-Means Clustering

[![Build Status](https://travis-ci.org/jbeuckm/K-Means.png)](https://travis-ci.org/jbeuckm/K-Means)

A basic Javascript implementation of the [cluster analysis] [1] algorithm.

[1]: http://en.wikipedia.org/wiki/K-means_clustering "wikipedia article"

## Install

`npm i @jbeuckm/k-means-js --save`

## Usage

- Optionally, normalize the data.

The normalizer will scale numerical data between [0,1] and will generate n outputs of either zero or one for discrete data, eg. category.

```javascript
// Tell the normalizer about the category field.
var params = {
  category: "discrete",
};

// Category is a discrete field with two possible values.
// Value is a linear field with continuous possible values.
var data = [
  {
    category: "a",
    value: 25,
  },
  {
    category: "b",
    value: 7.6,
  },
  {
    category: "a",
    value: 28,
  },
];

import { dataset } from "@jbeuckm/k-means-js";

var ranges = dataset.findRanges(params, data);
var normalized = dataset.normalize(data, ranges);
```

- Run the algorithm.

```javascript
// This non-normalized sample data with n=k is a pretty awful example.
var points = [
  [0.1, 0.2, 0.3],
  [0.4, 0.5, 0.6],
  [0.7, 0.8, 0.9],
];

var k = 3;

import kmeans from "@jbeuckm/k-means-js";

var means = kmeans.cluster(points, k, console.log);
```

The call to cluster() will find the data's range in each dimension, generate k=3 random points, and iterate until the means are static.

- Find the best K

The method described by [Pham, et al.](http://www.ee.columbia.edu/~dpwe/papers/PhamDN05-kmeans.pdf) is implemented.
The algorithm evaluates K-means repeatedly for different values of K, and returns the best (guess) value for K as well as the set of means found during evaluation.

```javascript
import { phamBestK } from "@jbeuckm/k-means-js";

var maxKToTest = 10;
var result = phamBestK.findBestK(points, maxKToTest);

console.log("this data has " + result.K + " clusters");
console.log("cluster centroids = " + result.means);
```

- Denormalize data

Denormalization can be used to show the means discovered:

```javascript
for (var i = 0, l = result.means.length; i < l; i++) {
  console.log(dataset.denormalizeDatum(result.means[i], ranges));
}
```

## Todo

- ~denormalize data~
- provide ability to label data points, dimensions and means
- build an asynchronous version of the algorithm
