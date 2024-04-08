// TODO need to adjust so only applys fuzzy search after certain string length

export default class IndexSearch{

  constructor(lunr, index){
    this.index = index
    this.lunr = lunr;
    this.idx;
  }

  loadIndex(){
    this.idx = this.lunr.Index.load(this.index);
  }

  fuzzySearchFilter(term){
    return term.split("").length > 2 ? term + "~1" : term;
  }

  search(term){
    const query = this.fuzzySearchFilter(term);
    return this.idx.search(query);
  }
  
}