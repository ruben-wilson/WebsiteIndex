
export default class SearchRunner {
  constructor(IndexSearch, ResultsProcessor, SearchClient) {
    this.indexSearch = IndexSearch;
    this.resultsProcessor = ResultsProcessor;
    this.searchClient = SearchClient;
  }

  search(query) {
    const searchResults = this.indexSearch.search(query);
    const parsedResults = this.resultsProcessor.parseResults(searchResults);
    this.searchIndex.updateResults(parsedResults);
  }

  run() {
    this.indexSearch.loadIndex();
    this.searchIndex.connectInput(term, this.search);
  }
}



