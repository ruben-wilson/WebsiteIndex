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
 



