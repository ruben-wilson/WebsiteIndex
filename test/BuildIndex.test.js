const { Indexer } = require("../src/websiteIndexer.js");

describe("build Index and adds fields from searchfield", () => {
let path = require("path");
let fs = require("fs");
let lunr = require("lunr");
let cheerio = require("cheerio");


const maxPreviewChars = 1500;
let htmlFolder;

  beforeEach(() => {   
    indexer = new Indexer(fs, path, cheerio, htmlFolder, maxPreviewChars, lunr);
  });

  it("correctly asigns fields", () => {
    
    indexer.searchFields = ["fakeField", "secondField"];
    const response = indexer.buildIndex([{}], 'webName');

    expect(response.fields[0]).toEqual("f");
    expect(response.fields[1]).toEqual("s");
  });

  

});