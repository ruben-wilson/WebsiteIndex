class WebsiteIndexer {

  constructor(IndexGenerator, output) {
    this.indexGenerator = IndexGenerator;
    this.output = output;

    this.projectData = [];
    this.allProjectsContents = [];
    this.indexes;
  }

  getOutPut(){
    return this.output;
  }

  findAllFiles(websiteNames, allProjectPaths) {
    this.output.createLog("Creating Indexes for these Files :");

    websiteNames.forEach((website, i) => {
     const projectData = {
       Name: website,
       Path: allProjectPaths[i],
       Files: this.indexGenerator.findHtmlFilePaths(allProjectPaths[i], this.output),
     };
     if (!projectData.Files)
        return this.output;
      this.projectData.push(projectData);
      this.output.createFindFileLog(projectData.Name, projectData.Files)
    });


  }

  findAllTextContent() {
    const projectData = [];

    this.projectData.forEach((project, i) => {
      const projectHtml = this.indexGenerator.htmlFileToTextContent(
        project.Name,
        project.Path,
        project.Files,
        i
      );
      projectData.push(projectHtml);
    });

    this.allProjectsContents = projectData.flat();
  }

  buildIndexes() {
    this.indexes = this.indexGenerator.buildIndexes(this.allProjectsContents);
  }

  async saveIndex(allProjectPaths) {

    const documentObject = this.indexGenerator.buildDocumentObj(
      this.indexes.idx,
      this.indexes.previews
    );

    let err;
    allProjectPaths.forEach( async project => { 
      err = await this.indexGenerator.saveDocumentObj(documentObject, project);
    })

    return err;
  }

  createAllIndexes(websiteNames, allProjectPaths, outputEl) {
    
    this.output.setTrgEl(outputEl);
    this.output.createLog("Running ...")
    this.findAllFiles(websiteNames, allProjectPaths);
    this.findAllTextContent();

    this.buildIndexes();
    
    return this.saveIndex(allProjectPaths);
  }


}

module.exports = {
  WebsiteIndexer  
}
