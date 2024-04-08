
export default class SearchRunner {
  constructor(indexSearch, ResultsProcessor, SearchClient) {
    this.indexSearch = indexSearch;
    this.resultsProcessor = ResultsProcessor;
    this.searchClient = SearchClient;
  }

  search(query) {
    const searchResults = this.indexSearch.search(query);
    const filteredResults = this.resultsProcessor.preFilterLunrResults(searchResults);
    const parsedResults = this.resultsProcessor.parseResponse(filteredResults);
    this.searchClient.updateResults(parsedResults);
  }

  run() {
    this.indexSearch.loadIndex();
    this.searchClient.connectInput( (e) => this.search(e));
  }

}



