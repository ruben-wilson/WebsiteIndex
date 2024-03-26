const { Cheerio } = require("cheerio");
const { DataProcessor } = require("../../Indexer/src/DataProcessor");

describe('buildPreviews() out of doc objects', () => {

   const fs = require("fs");
   const path = require("path");

   let dataProcessor;

  beforeEach(() => {
    jest.restoreAllMocks();

    dataProcessor = new DataProcessor([], fs, path);
  });

  it("returns array with doc object as a preview object when one doc", () => {
    docs = [
      {
        id: [1, 0],
        link: "fileLink",
        t: "title",
        c: "Element Data",
        e: "element.parent.name",
        p: "website"
      },
    ];

    expect(dataProcessor.buildPreviews(docs, "website")).toEqual({
      "1,0": {
        t: "title",
        c: "Element Data",
        l: "fileLink",
        e: "element.parent.name",
        w: "website",
        },
      });
    });

    it("returns an empty array when passed an empty doc array", ()=>{

    docs = [];

    expect(dataProcessor.buildPreviews(docs, "website")).toEqual({});

  });

  it("cuts of preview if over PREVIEW LIMIT", () => {
    docs = [
      {
        id: [1, 0],
        link: "fileLink",
        t: "title",
        c: "Element Data",
        e: "element.parent.name",
        p: "website"
      },
    ];

    dataProcessor.maxPreviewChars = 10;

    expect(dataProcessor.buildPreviews(docs, "website")).toEqual({
      "1,0": {
        t: "title",
        c: "Element Da ...",
        l: "fileLink",
        e: "element.parent.name",
        w: "website",
      },
    });
  });

})