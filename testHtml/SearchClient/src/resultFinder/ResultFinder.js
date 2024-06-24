export default class SearchResultFinder {
  constructor(document) {
    this.document = document;

    this.trgEl;
  }

  scrollToEl() {
    this.trgEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  isFlexElement(element) {
    const style = window.getComputedStyle(element);
    return style.display === "flex" || style.display === "inline-flex";
  }

  highLightPageContent(matchData) {
    matchData = matchData.split(",").map((e) => parseInt(e));

    let isFlex = this.isFlexElement(this.trgEl);

    const highlightedText = this.highLightPreviewText(
      this.trgEl.innerText,
      matchData,
      isFlex
    );

    this.trgEl.innerHTML = highlightedText;
  }

  getFontSize(element) {
    const style = window.getComputedStyle(element);
    return style.fontSize;
  }


  createMarks(isFlex) {
    if (isFlex) {
      const markSize = parseInt(this.getFontSize(this.trgEl)) + 14
      const markS =  `<mark style="max-height: ${markSize}px;">`
      const markE = `</mark>`;
      return{ markS: markS, markE: markE, sizeOfMark: 39 }
    }else{

    return { markS: "<mark>", markE: "</mark>", sizeOfMark: 13};
  }
  }

  highLightPreviewText(indexPreview, matchData, isFlex) {

    let { markS: markS, markE: markE, sizeOfMark: sizeOfMark} = this.createMarks(isFlex);
  

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

      resize += sizeOfMark;
    }

    return indexPreview;
  }

  makeElementVisible(trgEl) {
    let srchedEls = {};
    const printChildEls = (el) => {
      let href = el.getAttribute("href");
      if (
        this.isHidden(trgEl) &&
        (href == null) | (href == "") &&
        el.type == "button"
      ) {
        el.click();
      } else if (href != null && this.isHidden(trgEl)) {
        if (href.split("").length > 1 && href.split("")[0] == "#") {
          console.log("CLICKED:  " + el.id);
          el.click();
        }
      }

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
  }

  isHidden(el) {
    return el.offsetParent === null;
  }

  run() {
    const params = new URLSearchParams(window.location.search);
    const matchData = params.get("matchData");
    const elId = params.get("elId");
    if (elId && elId != 'customObj') {
      this.trgEl = this.document.getElementById(elId);
      if (this.isHidden(this.trgEl)) {
        this.makeElementVisible(this.trgEl);
      }
      this.scrollToEl();
      this.highLightPageContent(matchData);
    }
  }
}

