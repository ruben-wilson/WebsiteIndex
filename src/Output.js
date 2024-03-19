class Output{

  constructor(){
    this.trgEl;
    this.err = [];
  }

  setTrgEl(trgEl){
    this.trgEl = trgEl;
  }

  createLog(string){
    this.trgEl.innerHtml += string;
  }

  createErrLog(string){
    this.err.push(string);
    return false;
  }

  createFindFileLog(website, files){
    console.log(files)
    files.forEach(file => {
      this.createLog(`webiste: ${website} | filePath: ${file}`);
    })
  }


}


module.exports = {
  Output
}
