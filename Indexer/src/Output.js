class Output {
  constructor() {
    this.trgEl;
    this.logs = [];
    this.err = [];
  }

  setTrgEl(trgEl) {
    this.trgEl = trgEl;
  }

  createLog(string, i = 70) {
    this.logs.push({ message: `<p>${string}</p>`, delay: i });
  }

  createSuccessLog(projectNames) {
    this.createLog(`<p>Successfully Saved Indexes ✅</p>`);
    this.createLog(`<p>Saved To :</p>`);
    projectNames.forEach((name) => {
      this.createLog(`<p>${name} ✅</p>`, 200);
    });
  }

  displayLogs() {
    this.logs.forEach((log, i) => {
      setTimeout(() => {
        this.trgEl.innerHTML += log.message;
        this.scrollToBottom(this.trgEl);
      }, log.delay * i);
    });
  }

  createErrLog(string) {
    this.err.push(string);
    return false;
  }

  scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  createFindFileLog(website, files) {
    this.createLog(`Webiste Name: ${website}`);
    this.createLog(`Included files :`);
    files.forEach((file, i) => {
      this.createLog(`${file}`, i);
    });
  }
}

module.exports = {
  Output,
};
