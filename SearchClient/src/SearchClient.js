export default class SearchClient {
  constructor(document, outputEl) {
    this.document = document;
    this.outputEl = this.document.getElementById(outputEl);
  }

  connectInput(inputId, callback) {
    const userInput = this.document.getElementById(inputId);
    userInput.addEventListener("input", this.runSearch(e, callback));
  }
  
  runSearch(event, callback) {
    const query = event.target.value;
    if (query != "" && query != null) {
       callback(query);
    }
  }

  updateResults(results) {
    this.outputEl.innerHTML = results;
  }
}
