const websiteIndexer = require("./main");

class outputEl {
  constructor() {
    this.innerHtml = "";
  }
}

const output = new outputEl();

async function a(){
 const err = await websiteIndexer.createAllIndexes(
   ["player", "onbo"],
   ["./html", "./testHtml"],
   output
 );

 console.log(output.innerHtml);
 console.log(err);

}


a()
