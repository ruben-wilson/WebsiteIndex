import IndexSearch from "./searcher/IndexSearch.js" ;
import SearchClient from "./searcher/SearchClient.js";
import ResultsProcessor from "./searcher/ResultsProcessor.js";
import SearchRunner from "./searcher/SearchRunner.js";
import ResultFinder from "./resultFinder/ResultFinder.js"

export default class ClassFactory {
  constructor(lunr, index, previews) {
    this.lunr = lunr;
    this.index = index;
    this.previews = previews;
  }

  createResultFinder(document) {
    return new ResultFinder(document);
  }

  createIndexSearcher() {
    return new IndexSearch(this.lunr, this.index);
  }

  createSearchClient(
    document,
    outputEl,
    inputEl,
    searchModalId,
    queryDeleteBtn
  ) {
    return new SearchClient(
      document,
      outputEl,
      inputEl,
      searchModalId,
      queryDeleteBtn
    );
  }

  createResultsProcessor() {
    return new ResultsProcessor(this.previews);
  }

  createSearchRunner(
    document,
    outputEl,
    inputEl,
    searchModalId,
    queryDeleteBtn
  ) {
    return new SearchRunner(
      this.createIndexSearcher(),
      this.createResultsProcessor(),
      this.createSearchClient(
        document,
        outputEl,
        inputEl,
        searchModalId,
        queryDeleteBtn
      )
    );
  }
}
