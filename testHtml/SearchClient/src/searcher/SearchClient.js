export default class SearchClient {

  constructor(document, outputElId, inputElId) {
    this.document = document;
    this.outputEl = this.document.getElementById(outputElId);
    this.inputEl = this.document.getElementById(inputElId);
    this.searchFunc;

    this.runSearch = this.runSearch.bind(this);
  }

  connectInput(callback) {
    this.searchFunc = callback;
    this.inputEl.addEventListener("input", (e) => this.runSearch(e));
  }

  runSearch(event) {
    const query = event.target.value;
    if (query.trim() != "" && query != null) {
      this.searchFunc(query)
    }else{
      this.outputEl.innerHTML = "";
    }
  }

  updateResults(results) {
    this.outputEl.innerHTML = results;
  }

}
