const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const EXCLUDED_FILES = [];

const isHtml = (filename) => {
  const lower = filename.toLowerCase();
  return lower.endsWith(".html");
};

const findHtml = (folder) => {
  if (!fs.existsSync(folder)) {
    console.log(`Could not find folder: + ${folder}`);
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
};

const readInHtml = (filePath) => {
  return fs.readFileSync(filePath).toString();
};

const formatHtml = (html) => {
  const $ = cheerio.load(html);

  let i = 0;
  $("*").each(function () {
    const tagName = $(this)[0].tagName;
    const attributes = $(this)[0].attribs["id"];

    condition =
      (tagName != "html") &
      (tagName != "link") &
      (tagName != "meta") &
      (tagName != "script") &
      !attributes;

    if (condition) {
      $(this)[0].attribs.id = JSON.stringify(i) ;
      i++;
    }
  });

  return $.html();
};

const writeToFile = (trgPath, data) => {
  error = fs.writeFile(trgPath, data, () => {
    console.log("success" + trgPath);
  });
  return error;
};

const run = () => {
  const htmlFolder = "./html";
  const filePaths = findHtml(htmlFolder);
  filePaths.forEach((file) => {
    const filePath = path.join(htmlFolder, file);
    const string = readInHtml(filePath);
    const processed = formatHtml(string);
    console.log(filePath);
    writeToFile(filePath, processed);
  });
};

module.exports = {
  run,
};
