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
    this.searchModal.addEventListener("shown.bs.modal", this.focusInput);
  }

  setUpSearchModal(query){
    if (query.length > 0){
      this.queryDeleteBtn.classList.remove('hidden')
      this.queryDeleteBtn.addEventListener('click', this.clearInput)

    }else{
      this.queryDeleteBtn.classList.add("hidden");
    }
  }

  clearInput(){
    this.inputEl.value = '';
    this.clearResults();
    this.inputEl.focus();
  }

  focusInput(){
    this.inputEl.focus()
  }

  clearResults(){
   this.outputEl.innerHTML = "";
  }

  runSearch(event) {
    const query = event.target.value;
    if (query != null) {
      this.searchFunc(query)
    }else{
      this.clearResults()
    }
  }

  updateResults(results) {
    this.outputEl.innerHTML = results;
  }

}
