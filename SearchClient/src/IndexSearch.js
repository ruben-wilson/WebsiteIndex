export default class IndexSearch{

  constructor(lunr, index){
    this.index = index
    this.lunr = lunr;
    this.idx;
  }

  loadIndex(){
    this.idx = this.lunr.Index.load(this.index);
  }

  search(term){
    return this.idx.search(term);
  }

}