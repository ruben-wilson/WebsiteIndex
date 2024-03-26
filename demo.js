const websiteIndexer = require("./Indexer/Main");

class outputEl {
  constructor() {
    this.innerHtml = "";
  }
}

const output = new outputEl();

async function a(){
 const err = await websiteIndexer.createAllIndexes(
   ["player"],
   ["./html"],
   output
 );
 
 console.log(output.innerHtml);
 console.log(err);
}



a();



