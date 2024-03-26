const cheerio  = require("cheerio");
const { formatHtml }= require("../../PreProcessor/Main");
const { JSDOM } = require("jsdom");


describe("FormatHtml()" , ()=>{
  let document;

  beforeEach(()=>{
 
  })

  it("takes a string path to a project, returns same html but with added id on text content", ()=>{
    const expectedResponse = '<html><head id="0"></head><body id="1"><div id="app">Mock Content</div></body></html>';

    // console.log(document.serialize());
    const html = `<html><head /><body><div id="app">Mock Content</div></body></html>`;
    const response = formatHtml(html);

    expect(response).toEqual(expectedResponse);
  })
})