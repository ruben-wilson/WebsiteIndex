const DataProcessor = require("./DataProcessor");
const HtmlReader = require("./HtmlReader");

class IndexGenerator {
  constructor(websiteName, trgPath, htmlReader, dataProcessor) {
    this.websiteName = websiteName;
    this.trgPath = trgPath;
    this.htmlReader = htmlReader;
    this.dataProcessor = dataProcessor;

    this.htmlFilePaths = [];
    this.websiteContent = [];
    this.idx;
    this.previews;
  }

  findHtmlFilePaths(trgPath) {
    return this.htmlReader.findHtml(trgPath);
  }

  htmlFileToTextContent(projectName, projectPath, files, fileId) {
    files.forEach((file, index) => {
      this.htmlReader.readHtml(projectName, projectPath, file, [fileId, index]);
    });
    return this.htmlReader.readHtml(projectPath, relativeFilePath, fileId);
  }

  buildIndexes(websiteContent) {
    const idx = this.dataProcessor.buildIndex(websiteContent);
    const previews = this.dataProcessor.buildPreviews(websiteContent);

    return { idx: idx, previews: previews };
  }

  buildDocumentObj(idx, previews) {
    return this.dataProcessor.buildDocumentObj(idx, previews);
  }

  saveDocumentObj(docObj, projectPath) {
    return this.dataProcessor.writeToFile(docObj, projectPath) ? error : false;
  }
}

module.exports = {
  SearchIndex,
};
