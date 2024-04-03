const { PreProcessor } = require("./src/PreProcessor")
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const preProcessor = PreProcessor(cheerio, fs, path, output, [], folderPath)