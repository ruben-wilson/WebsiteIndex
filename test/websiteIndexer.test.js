const {formatContent} = require('../websiteIndexer');
 
 
 describe("formatContent() correctly extracts all content based text", ()=>{
    
  it("it returns a string",()=>{

      expect(formatContent("").toBe(""))
    })

 })