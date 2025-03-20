const { dataset } = require("../dist/main");

describe("Dataset", function () {
  const data = [
    {
      category: 1,
      value: 1,
    },
    {
      category: 2,
      value: 50,
    },
    {
      category: 1,
      value: 100,
    },
    {
      category: 1,
      value: 75,
    },
  ];

  const params = {
    category: "discrete",
  };

  let ranges, normalized;

  it("finds data ranges", function () {
    ranges = dataset.findRanges(params, data);

    expect(ranges["category"].type).toEqual("discrete");
    expect(ranges["category"].values.length).toEqual(2);

    expect(ranges["value"].type).toEqual("linear");
    expect(ranges["value"].min).toEqual(1);
    expect(ranges["value"].max).toEqual(100);
  });

  it("normalizes data", function () {
    normalized = dataset.normalize(data, ranges);

    expect(normalized.length).toEqual(data.length);
    expect(normalized[0].length).toEqual(3);
  });

  it("denormalizes data", function () {
    ranges = dataset.findRanges(params, data);

    normalized = dataset.normalize(data, ranges);

    for (let i = 0, l = normalized.length; i < l; i++) {
      const denorm = dataset.denormalizeDatum(normalized[i], ranges);

      console.log("testing normalized:");
      console.log(denorm);
      console.log("against denormalized:");
      console.log(data[i]);

      expect(denorm).toEqual(data[i]);
    }
  });

  it("handles empty data array", function () {
    ranges = dataset.findRanges(params, []);

    expect(ranges).toEqual({});
  });

  it("handles data with only linear fields", function () {
    const linearData = [{ value: 10 }, { value: 20 }, { value: 30 }];

    ranges = dataset.findRanges({}, linearData);

    expect(ranges["value"].type).toEqual("linear");
    expect(ranges["value"].min).toEqual(10);
    expect(ranges["value"].max).toEqual(30);
    expect(ranges["value"].range).toEqual(20);
  });

  it("handles data with mixed field types", function () {
    const mixedData = [
      { category: 1, value: 10 },
      { category: 2, value: 20 },
      { category: 1, value: 30 },
    ];

    ranges = dataset.findRanges(params, mixedData);

    expect(ranges["category"].type).toEqual("discrete");
    expect(ranges["category"].values.length).toEqual(2);

    expect(ranges["value"].type).toEqual("linear");
    expect(ranges["value"].min).toEqual(10);
    expect(ranges["value"].max).toEqual(30);
    expect(ranges["value"].range).toEqual(20);
  });

  it("uses weights on categorical fields", function () {
    const data = [
      { category: "a", value: 10 },
      { category: "b", value: 20 },
      { category: "c", value: 30 },
    ];

    const weights = {
      category: 5,
    };

    const ranges = dataset.findRanges(params, data);
    const normalized = dataset.normalize(data, ranges, weights);

    console.log(normalized);

    expect(normalized[0]).toEqual([5, 0, 0, 0]);
  });

  it("uses weights on linear fields", function () {
    const data = [
      { category: "a", value: 30 },
      { category: "b", value: 20 },
      { category: "c", value: 10 },
    ];

    const weights = {
      value: 22,
    };

    const ranges = dataset.findRanges(params, data);
    const normalized = dataset.normalize(data, ranges, weights);

    expect(normalized[0]).toEqual([1, 0, 0, 22]);
  });
});
