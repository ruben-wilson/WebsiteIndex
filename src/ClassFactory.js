const { HtmlReader } = require("./HtmlReader");
const { DataProcessor } = require("./DataProcessor");
const { IndexGenerator } = require("./IndexGenerator");
const { WebsiteIndexer } = require("./websiteIndexer");
const { Output } = require('./Output');

class ClassFactory {
  constructor(fs, path, cheerio, lunr) {
    this.fs = fs;
    this.path = path;
    this.cheerio = cheerio;
    this.lunr = lunr;
  }

  createOutputObj(){
   return new Output();
  }


  createHtmlReader() {
    const excludedFiles = [];
    return new HtmlReader(this.fs, this.path, this.cheerio, excludedFiles);
  }

  createDataProcessor() {
    const searchFields = ["title", "content"];
    const maxPreviewChars = 1500;
    return new DataProcessor(this.fs, this.path, this.lunr, searchFields, maxPreviewChars);
  }

  createIndexGenerator() {
    return new IndexGenerator(
      this.createHtmlReader(),
      this.createDataProcessor()
    );
  }

  createWebsiteIndexer() {
    return new WebsiteIndexer(this.createIndexGenerator(), this.createOutputObj());
  }
  
}

module.exports = {
  ClassFactory,
};
