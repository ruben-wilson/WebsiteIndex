const { Indexer } = require("../src/websiteIndexer.js");

describe("readHtml() extracts text content of html page", () => {
  jest.mock("fs");
  jest.mock("path");

  const fs = require("fs");
  const path = require("path");
  const cheerio = require("cheerio");

  let file = {};
  let indexer;

  path.join.mockImplementation((file, subFile) => {
    return `${file}/${subFile}`; // Custom implementation for path.join()
  });


  beforeEach(() => {
    jest.restoreAllMocks();

    indexer = new Indexer(fs, path, cheerio);
  });

  it("returns empty object if file empty", () => {
    fs.readFileSync.mockReturnValueOnce('')
    expect(indexer.readHtml("./html", file, 1)).toEqual([]);
  });

  it("returns string returned from cheerio as content in response object", ()=>{
     fs.readFileSync.mockReturnValueOnce("returned string");

     file = 'fileName.html'
     expectedResponse = {
       c: "returned string",
       e: "body",
       id: [1, 0],
       link: file,
       t: "",
     };

     expect(indexer.readHtml("./html", file, 1)).toEqual([expectedResponse]);
  })

  it("doesn't return content of el if not equal to script", () => {

    fs.readFileSync.mockReturnValueOnce('<script> text </script>');


    file = "fileName.html";
    expectedResponse = {
      c: "returned string",
      e: "body",
      id: [1, 0],
      link: file,
      t: "",
    };

    expect(indexer.readHtml("./html", file, 1)).toEqual([]);
  });

});