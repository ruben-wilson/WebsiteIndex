let path = require("path");
let fs = require("fs");
let lunr = require("lunr");
let cheerio = require("cheerio");

const { ClassFactory } = require("./src/ClassFactory")

const factory = new ClassFactory(fs, path, cheerio, lunr);

const websiteIndexer = factory.createWebsiteIndexer()

// console.log(output);


// class outputEl {
//   constructor() {
//     this.innerHtml = "";
//   }
// }

// const demoEl = new outputEl();

// const err = websiteIndexer.createAllIndexes(["player", "onbo"], ["./html",  "./testHtml"], demoEl);
// console.log("Main 24: " );
// console.log(err);
// console.log(output.trgEl);

module.exports = factory.createWebsiteIndexer();
