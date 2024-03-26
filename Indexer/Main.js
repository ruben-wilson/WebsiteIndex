const path = require("path");
const fs = require("fs");
const lunr = require("lunr");
const cheerio = require("cheerio");

const { ClassFactory } = require("./src/ClassFactory")

const factory = new ClassFactory(fs, path, cheerio, lunr);



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
