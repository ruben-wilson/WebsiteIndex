# WebsiteIndexer



## Requirements 

- allows for html from different websites to be indexed correctly with name of website
- can manually include html 
- testable 
- clean and refactored code 
- can take in strings to remove from index


### classes

htmlReader:

deals with all I/O operations

isHtml(fileName)
  -> returns Boolean depending if file ends with .html

findHtml(FolderPath)
  -> finds the path for each html file in dir 
  -> returns Array of all html files paths i

readHtml(folderPath, fileName, fileId)
  -> reads in html file and finds all text content 
  -> returns an array of Objects of text content data

removeDuplicates()
  -> removes all duplicate objects with matching content within the same file 
  -> returns array of objects

ErrorHandler()
  -> returns an error to be displayed 

writeToFile()
  -> writes a idx + previews into memory inside of trg Dir
  -> returns Boolean 


DataProcessor:

builds previews and index

buildIndex(docs)
  -> takes in all fields and uses them to create an index using Lunr module 
 -> returns an object

buildPreviews(doc, websiteName)
  -> builds previews for index reference 
  -> returns preview Object 

buildDocumentObj(idx, previews)
  -> builds the Object made up of the index and previews to write to file 
  returns -> string 


SearchIndex:
 takes in websiteName and Path and generates an index 

websiteIndexer:
 takes in a list of names and creates a index of all them 
 outputed to each index 




sudo code:

User inputs website name + file-location
find all file paths  
collect all text content from html file
create indexs from text content for each website:
              index 
              previews 
combine the indexes 
save indexs to each project directory
 



  <!-- createResultHtml(wName, title, content, link, elName) {
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
                            <small class="mb-1"${content}</small>
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
  } -->