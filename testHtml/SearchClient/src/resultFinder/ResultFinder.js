export default class SearchResultFinder {
  constructor(document) {
    this.document = document;

    this.trgEl;
  }

  scrollToEl() {
    this.trgEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // window.scrollBy({ top: -25, behavior: "smooth" });
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

    console.log(indexPreview);
    return indexPreview;
  }

  run() {
    const params = new URLSearchParams(window.location.search);
    const matchData = params.get("matchData"); // 'value1'
    const elId = params.get("elId"); // 'value2'
    if (elId) {
      this.trgEl = this.document.getElementById(elId);
      this.scrollToEl();
      this.highLightPageContent(elId, matchData);
    }
  }
}