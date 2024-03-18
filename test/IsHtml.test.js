const { Indexer } = require("../src/websiteInd.js");

describe("isHtml() decides if file is a .html file returns true or false", () => {
  let indexer;
  jest.mock("fs");

  const fs = require("fs");

  beforeEach(() => {
    indexer = new Indexer(fs);
  });

  it("return true when passed a html fileName with.html and false when without", () => {
    expect(indexer.isHtml("file.html")).toEqual(true);
    expect(indexer.isHtml("file.htm")).toEqual(false);
    expect(indexer.isHtml("file")).toEqual(false);
  });
});
