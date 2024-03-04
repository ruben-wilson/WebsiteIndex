var path = require("path");
var fs = require("fs");
var lunr = require("lunr");
var cheerio = require("cheerio");
// Change these constants to suit your needs
const HTML_FOLDER = "html"; // folder with your HTML files
// Valid search fields: "title", "description", "keywords", "body"
const SEARCH_FIELDS = ["title", "description", "keywords", "body"];
const EXCLUDE_FILES = ["search.html"];
const MAX_PREVIEW_CHARS = 1000; // Number of characters to show for a given search result
const OUTPUT_INDEX = "./html/lunrIndex.js"; // Index file

function isHtml(filename) {
  lower = filename.toLowerCase();
  return lower.endsWith(".html");
}

function findHtml(folder) {
  if (!fs.existsSync(folder)) {
    console.log("Could not find folder: ", folder);
    return;
  }

  var files = fs.readdirSync(folder);
  var htmls = [];

  // if (files.length == 0){
  //   console.log("Could not find any files: ");
  //   return;
  // }

  for (var i = 0; i < files.length; i++) {
    var filename = path.join(folder, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      var recursed = findHtml(filename);
      for (var j = 0; j < recursed.length; j++) {
        recursed[j] = path.join(files[i], recursed[j]).replace(/\\/g, "/");
      }
      htmls.push.apply(htmls, recursed);
    } else if (isHtml(filename) && !EXCLUDE_FILES.includes(files[i])) {
      htmls.push(files[i]);
    }
  }
  return htmls;
}

function readHtml(root, file, fileId) {
  var filename = path.join(root, file);
  var txt = fs.readFileSync(filename).toString();
  var $ = cheerio.load(txt);
  var title = $("title").text();
  if (typeof title == "undefined") title = file;
  var description = $("meta[name=description]").attr("content");
  if (typeof description == "undefined") description = "";
  var keywords = $("meta[name=keywords]").attr("content");
  if (typeof keywords == "undefined") keywords = "";
  var body = $("body");
  var content = $('[data-field=content]');
  if (typeof body == "undefined") body = "";

  subDocs = [];
  for(let i = 0; i < (content.length); i ++){
    var data = {
      id: [fileId, i],
      link: file,
      t: title,
      d: description,
      k: keywords,
      b: content.eq(i).text().trim(),
      elN: content.eq(i).attr("name"),
    };
    subDocs.push(data)

  }
  return subDocs;
}


function buildIndex(docs) {

  var idx = lunr(function () {
    this.ref("id");
    for (var i = 0; i < SEARCH_FIELDS.length; i++) {
      this.field(SEARCH_FIELDS[i].slice(0, 1));
    }
    this.metadataWhitelist = ["position"];

    docs.forEach(function (doc) {
      this.add(doc);
    }, this);
  });
  return idx;
}

function buildPreviews(docs) {
  var result = {};
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    // var preview = doc["d"];
    // if (preview == "") preview = doc["b"];
    var preview = doc["b"];
    if (preview.length > MAX_PREVIEW_CHARS)
      preview = preview.slice(0, MAX_PREVIEW_CHARS) + " ...";
    result[doc["id"]] = {
      t: doc["t"],
      p: preview,
      l: doc["link"],
      elN: doc['elN']

    };
  }
  return result;
}

function main() {
  files = findHtml(HTML_FOLDER);
  var docs = [];
  console.log("Building index for these files:");
  for (var i = 0; i < files.length; i++) {
    console.log("    " + files[i]);
    docs.push(readHtml(HTML_FOLDER, files[i], i));
  }
  docs = docs.flat()
  var idx = buildIndex(docs);
  var previews = buildPreviews(docs);
  var js =
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

main();
