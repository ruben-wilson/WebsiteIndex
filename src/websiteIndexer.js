class WebsiteIndexer {

  constructor(IndexGenerator) {
    this.indexGenerator = IndexGenerator;

    this.projectData = [];
    this.allProjectsContents = [];
    this.indexes;
  }

  findAllFiles(websiteNames, allProjectPaths) {
    websiteNames.forEach(website, (i) => {
      this.projectData.append({
        Name: website,
        Path: allProjectPaths[i],
        Files: this.indexGenerator.findHtmlFilePaths(project),
      });
    });
  }

  findAllTextContent() {
    this.projectData.forEach(project, (i) => {
      const projectHtml = this.indexGenerator.htmlFileToTextContent(
        project.Name,
        project.Path,
        project.Files,
        i
      );
      this.allProjectsContents.append(projectHtml);
    });
  }

  buildIndexes() {
    this.indexes = this.indexGenerator.buildIndexes(this.allProjectsContents);
  }

  async saveIndex(allProjectPaths) {

    const documentObject = this.indexGenerator.buildDocumentObj(
      this.indexes.idx,
      this.indexes.previews
    );

    allProjectPaths.forEach( async project => { 
      await this.indexGenerator.saveDocumentObj(documentObject, project);
    })
  
  }

  generateIndexes(websiteNames, allProjectPaths) {
    this.findAllFiles(websiteNames, allProjectPaths);
    this.findAllTextContent();
    this.buildIndexes();
    this.saveIndex(allProjectPaths);
  }
  
}

module.exports = {
  WebsiteIndexer  
}
