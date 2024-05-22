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
    if (!this.isEmptyObject(websiteResults)) {
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

        let id = websiteResults[key][0]["ref"];
        let link = this.preview[id]["l"];

        html.push(this.createResultWnameHtml(key, link, resultHtml.join("")));
      });

      return html.join("");
    } else {
      return this.noResultsHtml();
    }
  }

  noResultsHtml() {
    return `<div class="text-center">
<p class="fs-4">Your search returned no results</p>
<ul class="mt-2 gap-1">Try searching for:
  <li class="list-group-item mt-2"><a href="play-ss-credit-trader-workflow.html" class="link-primary fw-bold">Credit Trader Workflow</a></li>
  <li class="list-group-item"><a href="play-bs-asset-owner-prepare.html?matchData=4%2C4&elId=191" class="link-primary fw-bold">Asset Owner Prepare for a meeting</a></li>
  <li class="list-group-item"><a href="play-co-corporate-treasurer-prepare.html?matchData=0%2C8%2C9%2C4&elId=155" class="link-primary fw-bold">Corporate Treasury Question Bank</a></li>
</ul>
            </div>`;
  }

  createResultWnameHtml(wName, link, results) {
    const wLink = this.checkWebsiteLink(link);
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

  checkWebsiteLink(link) {
    let projectName = link.split("/")[3].toLowerCase();
    if (projectName.includes("play")) {
      return "../../fskghtml/playhtml/play-index.html";
    } else if (projectName.includes("onbo")) {
      return "../../fskghtml/onbohtml/onbo-index.html";
    }
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
