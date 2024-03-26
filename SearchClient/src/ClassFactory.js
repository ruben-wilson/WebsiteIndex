import IndexSearch from "./IndexSearch.js" ;
import SearchClient from "./SearchClient.js";
import ResultsProcessor from "./ResultsProcessor.js";
import SearchRunner from "./SearchRunner.js";

export default class ClassFactory {

  constructor(lunr) {
    this.lunr = lunr;
  }

  createIndexSearcher() {
    return new IndexSearch(this.lunr);
  }

  createSearchClient(document, outputEl) {
    return new SearchClient(document, outputEl);
  }

  createResultsProcessor() {
    return new ResultsProcessor();
  }

  createSearchRunner(document, outputEl) {
    return new SearchRunner(
      this.createIndexSearcher(),
      this.createResultsProcessor(),
      this.createSearchClient(document, outputEl)
    );
  }

}
