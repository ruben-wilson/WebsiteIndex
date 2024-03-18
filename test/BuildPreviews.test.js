const { Cheerio } = require("cheerio");
const { Indexer } = require("../src/websiteInd.js");

describe('buildPreviews() out of doc objects', () => {

   const fs = require("fs");
   const path = require("path");

   let indexer;

  beforeEach(() => {
    jest.restoreAllMocks();

    indexer = new Indexer([], fs, path);
  });

  it("returns array with doc object as a preview object when one doc", () => {
    docs = [
      {
        id: [1, 0],
        link: "fileLink",
        t: "title",
        c: "Element Data",
        e: "element.parent.name",
      },
    ];

    expect(indexer.buildPreviews(docs, "website")).toEqual({
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

    expect(indexer.buildPreviews(docs, "website")).toEqual({});

  });

  it("cuts of preview if over PREVIEW LIMIT", () => {
    docs = [
      {
        id: [1, 0],
        link: "fileLink",
        t: "title",
        c: "Element Data",
        e: "element.parent.name",
      },
    ];

    indexer.maxPreviewChars = 10;

    expect(indexer.buildPreviews(docs, "website")).toEqual({
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