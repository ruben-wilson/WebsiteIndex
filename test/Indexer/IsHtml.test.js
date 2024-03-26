const { HtmlReader } = require("../../Indexer/src/HtmlReader");

describe("isHtml() decides if file is a .html file returns true or false", () => {
  let htmlReader;
  jest.mock("fs");

  const fs = require("fs");

  beforeEach(() => {
    htmlReader = new HtmlReader(fs);
  });

  it("return true when passed a html fileName with.html and false when without", () => {
    expect(htmlReader.isHtml("file.html")).toEqual(true);
    expect(htmlReader.isHtml("file.htm")).toEqual(false);
    expect(htmlReader.isHtml("file")).toEqual(false);
  });
});
