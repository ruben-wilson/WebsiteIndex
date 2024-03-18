const DataProcessor = require("./DataProcessor");
const HtmlReader = require("./HtmlReader");


class SearchIndex{

  constructor(websiteName, trgPath, htmlReader, dataProcessor){
    this.websiteName = websiteName;
    this.trgPath = trgPath;
    this.htmlReader = htmlReader;
    this.dataProcessor = dataProcessor;

    this.htmlFilePaths = [];
    this.websiteContent = [];
    this.idx;
    this.previews;
  }

  findHtmlFilePaths(trgPath){
    return this.htmlReader.findHtml(trgPath);
  }

  htmlFileToTextContent(projectPath, relativeFilePath, fileId){
    return this.htmlReader.readHtml(projectPath, relativeFilePath, fileId);
  }

  buildIndexes(websiteContent, websiteName){
    const idx = this.dataProcessor.buildIndex(websiteContent);
    const previews = this.dataProcessor.buildPreviews(websiteContent, websiteName);

    return [idx, previews];
  }

  buildDocumentObj(idx, previews){
    return this.dataProcessor.buildDocumentObj(idx, previews);
  }

  saveDocumentObj(docObj){
    return this.dataProcessor.writeToFile(docObj) ? error : false;
  }


}

module.exports = {
  SearchIndex
}