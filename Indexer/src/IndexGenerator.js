const DataProcessor = require("./DataProcessor");
const HtmlReader = require("./HtmlReader");

class IndexGenerator {
  constructor(htmlReader, dataProcessor) {
    this.htmlReader = htmlReader;
    this.dataProcessor = dataProcessor;

    this.htmlFilePaths = [];
    this.idx;
    this.previews;
  }

  findHtmlFilePaths(trgPath, output) {
    return this.htmlReader.findHtml(trgPath, output);
  }

  htmlFileToTextContent(projectName, projectPath, files, fileId) {
    const websiteContent = [];
    // for each file in project
    files.forEach((file, index) => {
      // return an array of objects for each text el
      const fileHtml = this.htmlReader.readHtml(projectName, projectPath, file, [fileId, index]);
      websiteContent.push(fileHtml);
    });
 
    // return an array of objects for all webcontent in a website
    return websiteContent.flat();
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
    const error = this.dataProcessor.writeToFile(docObj, projectPath);
    return !error ? error : true;
  }
}

module.exports = {
  IndexGenerator,
};
