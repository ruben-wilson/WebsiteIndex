"use strict";

var LUNR_CONFIG = {
  resultsElementId: "searchResults", // Element to contain results
};

// extract all match postions form Response
function extractArrays(obj) {
  let arrays = [];

  function exploreObject(obj) {
    for (let key in obj) {
      if( key != "t"){
        
        if (Array.isArray(obj[key])) {
          arrays.push(obj[key]);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          exploreObject(obj[key]);
        }
      }
    }
  }

  exploreObject(obj);
  return arrays;
}


function createPreview(item, result) {
  let preview = item["c"];
  const fPs = result.matchData.metadata;
  const markS = "<mark>";
  const markE = "</mark>";
  let resize = 0;
  let array = extractArrays(fPs)
    .flat()
    .sort((a, b) => a[0] - b[0])
    .flat();

  const length = array.length 
  for (let i = 0; i < length; i += 2) {
    let startPos = array[i] + resize
    let endPos = array[i] + (array[i + 1]) + resize;
    preview =
      preview.slice(0, startPos) +
      markS +
      preview.slice(startPos, endPos) +
      markE +
      preview.slice(endPos);

      resize += 13;

    }

  return preview
  // console.log(preview.split("").slice(321, 330));
}

function resultHtml(wName, title, content, link){
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
// Parse search results into HTML
function parseLunrResults(results) {
  let html = [];

  for (let i = 0; i < results.length; i++) {

    let id = results[i]["ref"],
      item = PREVIEW_LOOKUP[id],
      title = item["t"],
      wName = item["w"],
      preview = createPreview(item, results[i]),
      link = item["l"];

 
    html.push(resultHtml(wName, title, preview, link));
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

function filteredResults(results) {
  let filterResults = [];
  results.forEach((result) => {
    if (result.score > 2.5) {
      filterResults.push(result);
    }
  });

  if (filterResults.length >= 1) {
    return filterResults;
  }else {
    return results.splice(0,1);
  }
}

function searchLunr(query) {
  var idx = lunr.Index.load(LUNR_DATA);
  // Write results to page
  console.log(idx.search(query));
  var results = filteredResults(idx.search(query));
  var resultHtml = parseLunrResults(results);
  var elementId = LUNR_CONFIG["resultsElementId"];
  document.getElementById(elementId).innerHTML = resultHtml;
}

// When the window loads, read query parameters and perform search
window.onload = function () {
  const userIn = document.getElementById("queryInput");
  userIn.addEventListener("input", (e) => {
    let query = e.target.value
    if (query != "" && query != null) {
      searchLunr(query);
    }
  });
};

