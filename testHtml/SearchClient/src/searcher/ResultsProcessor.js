// TODO Need to implement filter results 

export default class ResultsProcessor {
  constructor(preview) {
    this.preview = preview;
  }

  preFilterLunrResults(results) {
    let maxScore = [];
    let minScore = [];
    console.log(results)
    results.forEach((result) => {
      if (result.score > 5) {
        maxScore.push(result);
      }
      if (result.score > 1.5) {
        minScore.push(result);
      }
    });

    if (maxScore.length >= 3) {
      return maxScore;
    } else if (minScore.length > 3) {
      return minScore.slice(0, 5);
    } else {
      return minScore;
    }
  }

  createLink(matchData, item) {
    const link = item["l"];

    const linkData = { matchData: matchData, elId: item["e"] };
    const linkString = new URLSearchParams(linkData).toString();
    return `${link}?${linkString}`;
  }

  parseResponse(results) {
    let html = [];

    for (let i = 0; i < results.length; i++) {
      const matchData = this.extractMatchPositions(
        results[i].matchData.metadata
      );

     
      let id = results[i]["ref"],
        item = this.preview[id],
        title = item["t"],
        wName = item["w"],
        elName = item["n"],
        preview = this.highLightPreviewText(item["c"], matchData),
        link = this.createLink(matchData, item);
      html.push(this.createResultHtml(wName, title, preview, link, elName));
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


  createResultHtml(wName, title, content, link, elName) {
        let type;
        if (elName == "PDF") {
          type = "PDF";
        } else if (elName == "VIDEO") {
          type = "Video";
        } else {
          type = "Web";
        }
        return `<div class="ms-2 mt-4">
                        <a href="" class="" target="_blank"><h6 class="link-primary">${wName}</h6></a>
                        <div class="list-group">
                          <a href=${link} class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                              <div class="mb-1 fs-6">${title}</div>
                              <small>${type}</small>
                            </div>
                            <small class="mb-1">${content}</small>
                          </a>
                        </div>
                        </div>`;
    // return `<div class="ms-2 mt-4">
    //             <a href="" class="" target="_blank">
    //               <h6 class="link-primary">${wName}</h6>
    //             </a>
    //             <div class="list-group">
    //               <a href=${link} class="list-group-item list-group-item-action list-group-item-light" aria-current="true">
    //                 <div class="d-flex w-100 justify-content-between">
    //                   <h6 class="mb-1">${title}</h6>
    //                 </div>
    //                 <small class="mb-1">${content}</small>
    //               </a>
    //             </div>
    //           </div>`;
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