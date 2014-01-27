K-Means Clustering
==================
[![Build Status](https://travis-ci.org/jbeuckm/K-Means.png)](https://travis-ci.org/jbeuckm/K-Means)

A basic Javascript implementation of the [cluster analysis] [1] algorithm.

  [1]: http://en.wikipedia.org/wiki/K-means_clustering "wikipedia article"

Usage
-----

* Optionally, normalize the data.

The normalizer will scale numerical data between [0,1] and will generate n outputs of either zero or one for discrete data, eg. category.

```javascript
// Tell the normalizer about the category field.
var params = {
   category: "discrete"
};

// Category is a discrete field with two possible values.
// Value is a linear field with continuous possible values.
var data = [
    {
       category: "a",
       value: 25
    },
    {
       category: "b",
       value: 7.6
    },
    {
       category: "a",
       value: 28
    }
];


var ranges = require('dataset').findRanges(params, data);
var normalized = require('dataset').normalize(data, ranges);
```


* Run the algorithm.

```javascript
// This non-normalized sample data with n=k is a pretty awful example.
var points = [
  [.1, .2, .3],
  [.4, .5, .6],
  [.7, .8, .9]
];

var k = 3;

var means = require('kmeans').algorithm(points, k, console.log);
```

The call to algorithm() will find the data's range in each dimension, generate k=2 random points, and iterate until the means are static.

* Find the best K

The method described by [Pham, et al.](http://www.ee.columbia.edu/~dpwe/papers/PhamDN05-kmeans.pdf) is implemented.
The algorithm evaluates K-means repeatedly for different values of K, and returns the best (guess) value for K as well as the set of means found during evaluation.

```javascript
var pbk = require('phamBestK');

var maxKToTest = 10;
var result = pbk.findBestK(points, maxKToTest);

console.log("this data has "+result.K+" clusters");
console.log("cluster centroids = "+result.means);
```

Todo
----

* Normalize and denormalize data
* provide ability to label data points, dimensions and means
* build an asynchronous version of the algorithm
