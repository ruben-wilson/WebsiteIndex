const { Indexer } = require("../websiteIndexer.js");


describe("removeDuplicates removes any objects with duplicate content from an array", () => {
  let indexer;

  beforeEach(()=>{
    indexer = new Indexer([]);
  })

  it("it returns an empty array when passed empty array", () => {
    expect(indexer.removeDuplicates([])).toEqual([]);
  });

  it("it returns an empty array when passed empty object", () => {
    expect(indexer.removeDuplicates([{}])).toEqual([{}]);
  });

  it("it removes objects with same content", () => {
    const obj = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj }, { c: "Unique Value" }];

    const results = array.slice(1);

    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes same duplicate objects with same content with 3 occurrences", () => {
    const obj = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj }, { ...obj }, { c: "Unique Value" }];

    const results = [{ ...obj }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes same duplicate objects with same content with 3 occurrences with 1 at end of arr", () => {
    const obj = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj }, { c: "Unique Value" }, { ...obj }];

    const results = [{ ...obj }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes 2 sets of duplicates", () => {
    const obj = { c: "Player Portal" };
    const obj2 = { c: "Some Thing" };
    const array = [
      { ...obj },
      { ...obj2 },
      { c: "Unique Value" },
      { ...obj },
      { ...obj2 },
    ];

    const results = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes 2 sets of duplicates with more occurrences", () => {
    const obj = { c: "Player Portal" };
    const obj2 = { c: "Some Thing" };
    const array = [
      { ...obj },
      { ...obj },
      { ...obj },
      { ...obj2 },
      { ...obj },
      { ...obj2 },
      { c: "Unique Value" },
      { ...obj },
      { ...obj2 },
      { ...obj2 },
    ];

    const results = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes multiply sets of duplicates with more occurrences", () => {
    const obj = { c: "Player Portal" };
    const obj2 = { c: "Some Thing" };
    const obj3 = { c: "Some Thing else" };
    const array = [
      { ...obj },
      { ...obj3 },
      { ...obj },
      { ...obj2 },
      { ...obj3 },
      { ...obj2 },
      { c: "Unique Value" },
      { ...obj3 },
      { ...obj2 },
      { ...obj2 },
    ];

    const results = [
      { ...obj },
      { ...obj3 },
      { ...obj2 },
      { c: "Unique Value" },
    ];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it doesn't remove similar content that isn't exact same", () => {
    const obj = { c: " Player Portal " };
    const obj2 = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }, { ...obj2 }];

    const results = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });
});
