let path = require("path");
let fs = require("fs");
let lunr = require("lunr");
let cheerio = require("cheerio");
const { Indexer } = require("./websiteIndexer");


const maxPreviewChars = 1500;
let htmlFolder  = './WEBSITEINDEXER';

indexr = new Indexer(fs, path, cheerio, htmlFolder, maxPreviewChars, lunr);

indexr.run()

module.export = {
  indexr
}