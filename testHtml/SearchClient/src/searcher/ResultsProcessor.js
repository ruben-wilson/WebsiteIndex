// TODO Split Results by website name

export default class ResultsProcessor {
  constructor(preview) {
    this.preview = preview;
  }

  preFilterLunrResults(results) {
    let maxScore = [];
    let minScore = [];
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

  splitByWebsite(preFilteredResults) {
    let websiteResults = {};
    preFilteredResults.forEach((result) => {
      let preview = this.preview[result["ref"]];

      if (websiteResults[preview["w"]] == undefined) {
        websiteResults[preview["w"]] = [result];
      } else {
        websiteResults[preview["w"]].push(result);
      }
    });

    return websiteResults;
  }

  createLink(matchData, item) {
    const link = item["l"];

    const linkData = { matchData: matchData, elId: item["e"] };
    const linkString = new URLSearchParams(linkData).toString();
    return `${link}?${linkString}`;
  }

  isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
 }


  parseResponse(websiteResults) {
    let html = [];
    if (!this.isEmptyObject(websiteResults)){
      Object.keys(websiteResults).forEach((key) => {
        let resultHtml = [];
        websiteResults[key].forEach((result) => {
          const matchData = this.extractMatchPositions(
            result.matchData.metadata
          );

          let id = result["ref"],
            item = this.preview[id],
            title = item["t"],
            wName = item["w"],
            elName = item["n"],
            preview = this.highLightPreviewText(item["c"], matchData),
            link = this.createLink(matchData, item);

          resultHtml.push(this.createResultHtml(title, preview, link, elName));
        });

        html.push(this.createResultWnameHtml(key, resultHtml.join("")));
      });

      return html.join("");
    }else{

      return "<p>Your search returned no results.</p>";
    }
  }

  createResultWnameHtml(wName, results) {
    const wLink = this.checkWebsiteLink(wName);
    console.log(wLink)
    return `<div class="ms-2 mt-4" >
              <a href=${wLink} class="" target="_blank"><h6 class="link-primary">${wName}</h6></a>
              ${results}
            </div>`;
  }

  createResultHtml(title, content, link, elName) {
    const type = this.checkResultType(elName);
    return `<div class="list-group">
              <a id="srchResult" href=${link} class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between" >
                  <div class="mb-1 fs-6">${title}</div>
                  <small>${type}</small>
                  </div>
                  <small class="mb-1">${content}</small>
                </a>
              </div>`;
  }

  checkResultType(type) {
    switch (type) {
      case "PDF":
        return "Pdf";
      case "VIDEO":
        return "Video";
      case "Web":
        return "Web";
      default:
        return "Web";
    }
  }

  checkWebsiteLink(wName) {
    switch (wName) {
      case "Player Portal":
        return "play-index.html";
      case "BU ONBO":
        return "onbo-index.html";
      case "Bu OnBo":
        return "onbo-index.html";
      case "Bu onbo":
        return "onbo-index.html";
      case "BU onbo":
        return "onbo-index.html";
      case "BU OnBo":
        return "onbo-index.html";
      default:
        return "";
    }
  }

  // createResultHtml(wName, title, content, link, elName) {
  //   const type = this.checkResultType(elName);
  //   const wLink = this.checkWebsiteLink(wName);
  //   return `<div class="ms-2 mt-4" >
  //             <a href=${wLink} class="" target="_blank"><h6 class="link-primary">${wName}</h6></a>
  //             <div class="list-group">
  //               <a id="srchResult" href=${link} class="list-group-item list-group-item-action">
  //                 <div class="d-flex w-100 justify-content-between" >
  //                   <div class="mb-1 fs-6">${title}</div>
  //                   <small>${type}</small>
  //                 </div>
  //                 <small class="mb-1">${content}</small>
  //               </a>
  //             </div>
  //           </div>`;
  // }

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