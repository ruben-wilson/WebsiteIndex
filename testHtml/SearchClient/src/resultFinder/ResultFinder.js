export default class SearchResultFinder {
  constructor(document) {
    this.document = document;

    this.trgEl;
  }

  scrollToEl() {
    this.trgEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  highLightPageContent(elId, matchData) {
    matchData = matchData.split(",").map((e) => parseInt(e));
    const highlightedText = this.highLightPreviewText(
      this.trgEl.innerText,
      matchData
    );

    this.trgEl.innerHTML = highlightedText;
  }

  highLightPreviewText(indexPreview, matchData) {
    const markS = "<mark>";
    const markE = "</mark>";
    let resize = 0;
    const length = matchData.length;
    for (let i = 0; i < length; i += 2) {
      let startPos = matchData[i] + resize;
      let endPos = matchData[i] + matchData[i + 1] + resize;
      indexPreview =
        indexPreview.slice(0, startPos) +
        markS +
        indexPreview.slice(startPos, endPos) +
        markE +
        indexPreview.slice(endPos);

      resize += 13;
    }

    return indexPreview;
  }

  makeElementVisible(trgEl) {
    let srchedEls = {};
    const printChildEls = (el) => {
  
      let href = el.getAttribute("href")
      if (this.isHidden(trgEl) && (href == null | href == "" ) && el.type == "button") {
        
        el.click();
      }else if (href != null &&this.isHidden(trgEl)){
        // href.split("")[0] == "#" && href.split("").length > 1;
        if ( href.split("").length > 1 && href.split("")[0] == "#") {
          console.log("CLICKED:  " + el.id);
          el.click();
        }
      };

      srchedEls[el.id] =
        srchedEls[el.id] == undefined ? 1 : srchedEls[el.id] + 1;

      if (el.children) {
        Array.from(el.children).forEach((child) => {
          if (srchedEls[child.id] == undefined) {
            printChildEls(child);
          }
        });
        return el;
      }
    };

    let element = trgEl;
    while (this.isHidden(trgEl) && element) {
      element = printChildEls(element);
      console.log(srchedEls);
      if (srchedEls[element.parentElement] == undefined) {
        element = element.parentElement;
      } else {
        element = element.parentElement.parentElement;
      }
    }
    this.scrollToEl();
  }

  isHidden(el) {
    return el.offsetParent === null;
  }

  run() {
    const params = new URLSearchParams(window.location.search);
    const matchData = params.get("matchData");
    const elId = params.get("elId");
    if (elId) {
      this.trgEl = this.document.getElementById(elId);
      if(this.isHidden(this.trgEl)){
        this.makeElementVisible(this.trgEl);
      }else{
        this.scrollToEl();
      }

      this.highLightPageContent(elId, matchData);
    }
  }
}

