"use strict";

var LUNR_CONFIG = {
  resultsElementId: "searchResults", // Element to contain results
  countElementId: "resultCount", // Element showing number of results
};

// Get URL arguments
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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
  let preview = item["p"];
  const fPs = result.matchData.metadata;
  const markS = "<mark>";
  const markE = "</mark>";
  let resize = 0;
  let array = extractArrays(fPs)
    .flat()
    .sort((a, b) => a[0] - b[0])
    .flat();

  console.log(array)
  let pLength = preview.split("").length;
  for (let i = 0; i < array.length; i += 2) {
    let startPos = array[i] + resize
    let endPos = array[i] + (array[i + 1]) + resize;
    console.log(resize + "  " + i)
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

// Parse search results into HTML
function parseLunrResults(results) {
  let html = [];
  for (let i = 0; i < results.length; i++) {
    let id = results[i]["ref"],
      item = PREVIEW_LOOKUP[id],
      title = item["t"],
      // preview = item['p'],
      preview = createPreview(item, results[i]),
      elName = item["elN"],
      link = item["l"];
    

    var result =
      '<p><span class="result-title"><a href="' +
      link +
      '">' +
      title +
      '</a></span><br><span class="result-preview">' +
      preview +
      "</span>" +
      "</p>";
    html.push(result);
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

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showResultCount(query, total, domElementId) {
  if (total == 0) {
    return;
  }

  var s = "";
  if (total > 1) {
    s = "s";
  }
  var found = "<p>Found " + total + " result" + s;
  if (query != "" && query != null) {
    query = escapeHtml(query);
    var forQuery = ' for <span class="result-query">' + query + "</span>";
  } else {
    var forQuery = "";
  }
  var element = document.getElementById(domElementId);
  element.innerHTML = found + forQuery + "</p>";
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
  }
  if (results.length < 3) {
    return results;
  } else {
    return results.splice(0, 1);
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
  // var count = results.length;
  // showResultCount(query, count, LUNR_CONFIG["countElementId"]);
}

// When the window loads, read query parameters and perform search
window.onload = function () {
  var query = getParameterByName("q");
  if (query != "" && query != null) {
    document.forms.lunrSearchForm.q.value = query;
    searchLunr(query);
  }
};
