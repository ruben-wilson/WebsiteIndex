let path = require("path");
let fs = require("fs");
let lunr = require("lunr");
let cheerio = require("cheerio");

const HTML_FOLDER = "./html"; // folder with your HTML files
// search fields: "title", "content"
const SEARCH_FIELDS = ["title", "content"];
const EXCLUDE_FILES = ["play-index.html"];
const MAX_PREVIEW_CHARS = 1000; // Number of characters to show for a given search result
const OUTPUT_INDEX = "./html/lunarIndex.js"; // Index file

class Indexer {
  constructor(fs, path, cheerio, htmlFolder, maxPreviewChars, lunr) {
    this.fs = fs;
    this.path = path;
    this.lunr = lunr;

    this.htmlFolder = htmlFolder;
    this.maxPreviewChars = maxPreviewChars;
    this.cheerio = cheerio;
    this.searchFields = ["title", "content"];
    this.exclude_files = [];
  }

  isHtml(filename) {
    const lower = filename.toLowerCase();
    return lower.endsWith(".html");
  }

  findHtml(folder) {
    if (!this.fs.existsSync(folder)) {
      console.log("Could not find folder: ", folder);
      return [];
    }

    let files = this.fs.readdirSync(folder);
    let html = [];

    for (const file of files) {
      let filename = this.path.join(folder, file);
      let stat = this.fs.lstatSync(filename);

      if (stat.isDirectory()) {
        let recursed = this.findHtml(filename);

        recursed.forEach((subFile, index) => {
          recursed[index] = this.path.join(file, subFile).replace(/\\/g, "/");
        });

        html.push.apply(html, recursed);
      } else if (this.isHtml(filename) && !this.exclude_files.includes(file)) {
        html.push(file);
      }
    }
    return html;
  }

  removeDuplicates(arr) {
    for (let i = 0; i < arr.length; i++) {
      let content = arr[i].c;

      for (let j = i + 1; j < arr.length; j++) {
        if (content == arr[j].c) {
          arr.splice(j, 1);
          j -= 1;
        }
      }
    }
    return arr;
  }

  readHtml(root, file, fileId) {
    let filename = this.path.join(root, file),
      txt = this.fs.readFileSync(filename).toString(),
      $ = this.cheerio.load(txt),
      title = $("title").text();
    if (typeof title == "undefined") title = file;

    // traverse through cheerio object to find all text content
    let results = [];
    let i = 0;
    function findTextContent(element) {
      if (element.type === "text") {
        if (
          (element.data.trim().length !== 0) &
          (element.parent.name !== "script") &
          (element.parent.name !== "style") &
          (element.parent.name !== "title") &
          (element.parent.name !== "a")
        ) {
          results.push({
            id: [fileId, i],
            link: file,
            t: title,
            c: element.data,
            e: element.parent.name || "N/A",
          });
          i++;
        }
      }

      if (element.children) {
        element.children.forEach((child) =>
          findTextContent(child, results, file, title, i)
        );
      }
      return results;
    }

    results = findTextContent($.root()[0]);
    // remove duplicate els
    return this.removeDuplicates(results).flat();
  }

  buildIndex(docs) {
    const searchFields = this.searchFields;

    let idx = this.lunr(function () {
      this.ref("id");
      this.metadataWhitelist = ["position"];

      for (let i = 0; i < searchFields.length; i++) {
        this.field(searchFields[i].slice(0, 1));
      }

      docs.forEach((doc) => {
        this.add(doc);
      }, this);
    });

    return idx;
  }

  buildPreviews(docs, website) {
    let result = {};
    for (const doc of docs) {
      let preview = doc["c"];
      if (preview.length > this.maxPreviewChars) {
        preview = preview.slice(0, this.maxPreviewChars) + " ...";
      }

      result[doc["id"]] = {
        t: doc["t"],
        c: preview,
        l: doc["link"],
        e: doc["e"],
        w: website,
      };
    }
    return result;
  }

  buildDocumentObj(idx, previews) {
    return (
      "const LUNR_DATA = " +
      JSON.stringify(idx) +
      ";\n" +
      "const PREVIEW_LOOKUP = " +
      JSON.stringify(previews) +
      ";"
    );
  }

  writeToFile(content) {
    const filePath = path.join(this.htmlFolder, "LunrTestOutput.js");

    this.fs.writeFile(filePath, content, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("Index saved as " + this.htmlFolder);
    });
  }

  async run() {
    console.log("Running ...");
    const files = this.findHtml(this.htmlFolder);
    let docs = [];

    console.log("Building index for these files:");
    for (let i = 0; i < files.length; i++) {
      console.log("    " + files[i]);
      docs.push(this.readHtml(this.htmlFolder, files[i], i));
    }
    docs = docs.flat();

    let idx = this.buildIndex(docs);
    let previews = this.buildPreviews(docs, "Player Portal");

    const fileContent = this.buildDocumentObj(idx, previews);
    await this.writeToFile(fileContent);
  }
}


module.exports = {
  Indexer,
};