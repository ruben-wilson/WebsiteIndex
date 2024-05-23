export default class SearchClient {

  constructor(document, outputElId, inputElId, searchModalId, queryDeleteBtn) {
    this.document = document;
    this.outputEl = this.document.getElementById(outputElId);
    this.inputEl = this.document.getElementById(inputElId);
    this.searchModal = this.document.getElementById(searchModalId);
    this.queryDeleteBtn = this.document.getElementById(queryDeleteBtn);
    this.searchFunc;

    this.runSearch = this.runSearch.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.focusInput = this.focusInput.bind(this);
  }

  connectInput(callback) {
    this.searchFunc = callback;
    this.inputEl.addEventListener("input", (e) => this.runSearch(e));
  }

  setUpSearchModal(){
    this.searchModal.addEventListener('shown.bs.modal', this.focusInput)
    this.queryDeleteBtn.addEventListener('click', this.clearInput)
  }

  clearInput(){
    this.inputEl.value = '';
     this.inputEl.focus();
  }

  focusInput(){
    this.inputEl.focus()
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
