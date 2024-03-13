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

class Indexer{

  constructor(args, fs){

    if(args.length > 2){
      args[2].toLowerCase() == "run" && this.main();
    }

    this.fs = fs;
    
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
  let htmls = [];
  for (let i = 0; i < files.length; i++) {
    let filename = path.join(folder, files[i]);
    let stat = this.fs.lstatSync(filename);
    if (stat.isDirectory()) {
      let recursed = this.findHtml(filename);
      for (let j = 0; j < recursed.length; j++) {
        recursed[j] = path.join(files[i], recursed[j]).replace(/\\/g, "/");
      }
      htmls.push.apply(htmls, recursed);
    } else if (this.isHtml(filename) && !EXCLUDE_FILES.includes(files[i])) {
      htmls.push(files[i]);
    }
  }
  return htmls;
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
    let filename = path.join(root, file);
    let txt = fs.readFileSync(filename).toString();
    let $ = cheerio.load(txt);
    let title = $("title").text();
    if (typeof title == "undefined") title = file;
    let description = $("meta[name=description]").attr("content");
    if (typeof description == "undefined") description = "";
    let keywords = $("meta[name=keywords]").attr("content");
    if (typeof keywords == "undefined") keywords = "";
    let body = $("body");
    let content = $("[data-field=content]");
    if (typeof body == "undefined") body = "";

    let results = [];
    let i = 0;

    function findTextContent(element) {
      if (element.type === "text") {
        if (
          element.data.trim().length !== 0 &&
          element.parent.name !== "script"
        ) {
          if (
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
      }

      if (element.children) {
        element.children.forEach((child) =>
          findTextContent(child, results, file, title, i)
        );
      }
      return results;
    }
    results = findTextContent($.root()[0]);

    return results.flat();
  }


  buildIndex(docs) {
    let idx = lunr(function () {
      this.ref("id");
      for (let i = 0; i < SEARCH_FIELDS.length; i++) {
        this.field(SEARCH_FIELDS[i].slice(0, 1));
      }
      this.metadataWhitelist = ["position"];

      docs.forEach(function (doc) {
        this.add(doc);
      }, this);
    });
    return idx;
  }

  buildPreviews(docs, website) {
    let result = {};
    for (let i = 0; i < docs.length; i++) {
      let doc = docs[i];

      let preview = doc["c"];
      if (preview.length > MAX_PREVIEW_CHARS)
        preview = preview.slice(0, MAX_PREVIEW_CHARS) + " ...";
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

  main() {
    console.log("Running ...");

    const files = this.findHtml(HTML_FOLDER);
    let docs = [];

    console.log("Building index for these files:");
    for (let i = 0; i < files.length; i++) {
      console.log("    " + files[i]);
      docs.push(this.readHtml(HTML_FOLDER, files[i], i));
    }
    docs = docs.flat();
    let idx = this.buildIndex(docs);
    let previews = this.buildPreviews(docs, "Player Portal");
    let js =
      "const LUNR_DATA = " +
      JSON.stringify(idx) +
      ";\n" +
      "const PREVIEW_LOOKUP = " +
      JSON.stringify(previews) +
      ";";

    fs.writeFile(OUTPUT_INDEX, js, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("Index saved as " + OUTPUT_INDEX);
    });
  }

}

// take in commandLine args 
const args = process.argv;
new Indexer(args);

module.exports = {
  Indexer
};
