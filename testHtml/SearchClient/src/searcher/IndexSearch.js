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

  fuzzySearchFilter(query){
    return query.split("").length > 3 ? query + "~1" : query;
  }

  search(query){
    const srchQuery = this.fuzzySearchFilter(query);
    return this.idx.search(srchQuery);
  }
  
}