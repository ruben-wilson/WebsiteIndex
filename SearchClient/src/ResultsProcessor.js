export default class ResultsProcessor {
  preFilterLunrResults() {}

  parseResponse(indexPreview) {
    let html = [];

    for (let i = 0; i < results.length; i++) {
      let id = results[i]["ref"],
        item = PREVIEW_LOOKUP[id],
        title = item["t"],
        wName = item["w"],
        preview = highLightPreviewText(item["p"], result[i].matchData.metadata),
        link = item["l"];

      html.push(this.createResultHtml(wName, title, preview, link));
    }

    if (html.length) {
      if (html.length > 5) {
        return html.slice(0, 5).join("");
      } else {
        return html.join("");
      }
    } else {
      return "<p>Your search returned no results.</p>";
    }
  }

  filterResponse() {}

  createResultHtml(wName, title, content, link) {
    return `<div class="ms-2 mt-4">
                <a href="" class="" target="_blank">
                  <h6 class="link-primary">${wName}</h6>
                </a>
                <div class="list-group">
                  <a href=${link} class="list-group-item list-group-item-action list-group-item-light" aria-current="true">
                    <div class="d-flex w-100 justify-content-between">
                      <h6 class="mb-1">${title}</h6>
                      <small>Terminal</small>
                    </div>
                    <small class="mb-1">${content}</small>
                  </a>
                </div>
              </div>`;
  }

  highLightPreviewText(indexPreview, matchData) {
    const markS = "<mark>";
    const markE = "</mark>";
    let resize = 0;
    let matchArr = this.extractMatchPositions(matchData);

    const length = matchArr.length;
    for (let i = 0; i < length; i += 2) {
      let startPos = matchArr[i] + matchArr;
      let endPos = matchArr[i] + array[i + 1] + resize;
      indexPreview =
        indexPreview.slice(0, startPos) +
        markS +
        indexPreview.slice(startPos, endPos) +
        markE +
        indexPreview.slice(endPos);

      resize += 13;
    }

    return preview;
  }

  extractMatchPositions(lunrResultObj) {
    let arrays = [];
    const exploreObject = (obj) => {
      for (let key in obj) {
        if (key != "t") {
          if (Array.isArray(obj[key])) {
            arrays.push(obj[key]);
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            exploreObject(obj[key]);
          }
        }
      }
    };

    exploreObject(lunrResultObj);
    return arrays
      .flat()
      .sort((a, b) => a[0] - b[0])
      .flat();
  }
}