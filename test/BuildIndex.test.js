const { Indexer } = require("../websiteIndexer.js");

describe("build Index and adds fields from searchfield", () => {
jest.mock("lunr");

const fs = require('fs');
const lunr = require('lunr');

  beforeEach(() => {   
    indexer = new Indexer(fs, lunr);
  });

  it("correctly asigns fields", () => {
    
    indexer.searchFields = ["fakeField", "secondField"];
    const response = indexer.buildIndex([{}], 'webName');

    expect(response.fields[0]).toEqual("f");
    expect(response.fields[1]).toEqual("s");
  });

  

});