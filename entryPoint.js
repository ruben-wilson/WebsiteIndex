let path = require("path");
let fs = require("fs");
let lunr = require("lunr");
let cheerio = require("cheerio");

const Indexer = require("./websiteIndexer");

const maxPreviewChars = 1500;
let htmlFolder;

indexr = new Indexer(fs, path, cheerio, htmlFolder, maxPreviewChars, lunr);

module.export = {
  indexr
}