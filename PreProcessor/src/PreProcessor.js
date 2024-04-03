// const cheerio = require("cheerio");
// const path = require("path");
// const fs = require("fs");

// const EXCLUDED_FILES = [];
class PreProcessor {
  constructor(cheerio, fs, path, output, excludedFiles, htmlFolder) {
    this.cheerio = cheerio;
    this.fs = fs;
    this.path = path;

    this.output = output;
    this.excludedFiles = excludedFiles;
    this.htmlFolder = htmlFolder;
  }

  isHtml(filename) {
    const lower = filename.toLowerCase();
    return lower.endsWith(".html");
  }

  findHtml(folder) {
    if (!fs.existsSync(folder)) {
      this.output.createErrLog(`Could not find folder: + ${folder}`);
      return [];
    }

    let files = fs.readdirSync(folder);
    let html = [];

    for (const file of files) {
      let filename = path.join(folder, file);
      let stat = fs.lstatSync(filename);

      if (stat.isDirectory()) {
        let recursed = findHtml(filename);

        recursed.forEach((subFile, index) => {
          recursed[index] = path.join(file, subFile).replace(/\\/g, "/");
        });

        html.push.apply(html, recursed);
      } else if (isHtml(filename) && !EXCLUDED_FILES.includes(file)) {
        html.push(file);
      }
    }
    return html;
  }

  readInHtml(filePath) {
    return fs.readFileSync(filePath).toString();
  }

  formatHtml(html) {
    const $ = cheerio.load(html);

    let i = 0;
    $("*").each(function () {
      const tagName = $(this)[0].tagName;
      const attributes = $(this)[0].attribs["id"];

      condition =
        (tagName != "head") &
        (tagName != "html") &
        (tagName != "link") &
        (tagName != "meta") &
        (tagName != "script") &
        !attributes;

      if (condition) {
        $(this)[0].attribs.id = JSON.stringify(i);
        i++;
      }
    });

    return $.html();
  }

  writeToFile(trgPath, data, output) {
    error = fs.writeFile(trgPath, data, () => {
      this.output.createLog("success" + trgPath);
    });
    return error;
  }

  run() {
    const filePaths = findHtml(this.htmlFolder);
    filePaths.forEach((file) => {
      const filePath = path.join(htmlFolder, file);
      const string = readInHtml(filePath);
      const processed = formatHtml(string);
      this.output.createLog(filePath);
      writeToFile(filePath, processed);
    });
  }
}
 
module.exports = {
  PreProcessor,
};
