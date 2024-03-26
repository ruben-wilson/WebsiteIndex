const { DataProcessor } = require("../../Indexer/src/DataProcessor");

describe("build Index and adds fields from searchfield", () => {
  let path = require("path");
  let fs = require("fs");
  let lunr = require("lunr");
  let cheerio = require("cheerio");

  const maxPreviewChars = 1500;


  beforeEach(() => {
    dataProcessor = new DataProcessor(
      fs,
      path,
      lunr,
      [],
      maxPreviewChars
    );
  });

  it("correctly asigns fields", () => {
    dataProcessor.searchFields = ["fakeField", "secondField"];
    const response = dataProcessor.buildIndex([{}], "webName");

    expect(response.fields[0]).toEqual("f");
    expect(response.fields[1]).toEqual("s");
  });
});
