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
   isElementVisible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }

   tryClickButtons(elementId) {
      const targetElement = document.getElementById(elementId);
      if (this.isElementVisible(targetElement)) {
          console.log("Target element is already visible.");
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
      }

      const buttons = document.querySelectorAll('button, a[role="button"]');
      let found = false;

      buttons.forEach(button => {
          if (!found) {
              button.click();
              // Check after a delay if the target is visible
              setTimeout(() => {
                  if (this.isElementVisible(targetElement)) {
                      console.log("Target element made visible after clicking:", button);
                      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      found = true;
                  }
              }, 100); // Adjust this delay based on expected response time
          }
      });

      if (!found) {
          console.log("Could not find a button that reveals the target element.");
      }
  }

  printElementsAndParents(elementId) {
    // Select the target element by its ID
    let element = document.getElementById(elementId);

    // Iterate up the DOM tree and print elements
    while (element) {
        console.log("Current Element: ", element.tagName, element.id ? `(ID: ${element.id})` : "");

        // Print all child elements of the current element
        console.log("Child Elements:");
        Array.from(element.children).forEach(child => {
            console.log(` - ${child.tagName}`, child.id ? `(ID: ${child.id})` : "");
        });

        // Move up to the parent element
        element = element.parentElement;
    }
  }



  run() {
    const params = new URLSearchParams(window.location.search);
    const matchData = params.get("matchData"); 
    const elId = params.get("elId"); 
    if (elId) {
      this.trgEl = this.document.getElementById(elId);
      console.log(this.trgEl)
      this.scrollToEl();

      // this.tryClickButtons(elId);

      this.highLightPageContent(elId, matchData);
    }
  }
}