# SearchClient

## Requirements

- take in client search terms from user
- search search index with search term
- read in response form index
- create search results
- highlight next page where search terms appear

### classes

SearchClient:
takes in user inputs and appends the results html to the page

  connectInputBox(){}

  updateResults(){}

IndexSearch:
search for search term in index and passes back results

    searchIndexFuzzy(){}


ResultsProcessor:
takes in search results and creates results in html passes back string

    createPreview(){}

    highLightPreviewText(){}

    createResultHtml(){}

    extractMatchPositions(){}

    qualityCheckResults(){}
