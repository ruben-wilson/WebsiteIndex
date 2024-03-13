const { Indexer } = require("../websiteIndexer.js");


describe("findHtml", () => {
  jest.mock("fs");
  jest.mock("path");

  const fs = require("fs");
  const path = require("path");


  beforeEach(()=>{
    jest.restoreAllMocks();
  })

  it("Finds file in directory", () => {
    // checks if folder exists
    fs.existsSync.mockReturnValue(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValue(["file1.html"]);

    // joins name of file with path
    path.join.mockReturnValue("./html/file1.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValue({ isDirectory : () => false});


    indexer = new Indexer([], fs);
    expect(indexer.findHtml("./html")).toEqual(["file1.html"]);
  })

  it("Finds files in directory", () => {
    // checks if folder exists
    fs.existsSync.mockReturnValue(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValue(["file1.html", "file2.html", "file3.html"]);

    // joins name of file with path
    path.join.mockReturnValue("./html/file1.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValue({ isDirectory: () => false });

    // joins name of file with path
    path.join.mockReturnValue("./html/file2.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValue({ isDirectory: () => false });

    // joins name of file with path
    path.join.mockReturnValue("./html/file3.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValue({ isDirectory: () => false });

    indexer = new Indexer([], fs);
    expect(indexer.findHtml("./html")).toEqual([
      "file1.html",
      "file2.html",
      "file3.html",
    ]);
  });

  it("Finds file in subdirectory", () => {
    // Mock file system and path operations
    fs.existsSync.mockReturnValue(true);

    // First call for the root directory, then for the subdirectory
    fs.readdirSync
      .mockReturnValueOnce(["subFolder"]) // For the root directory
      .mockReturnValueOnce(["file1.html"]); // For the subdirectory

    // Mock path.join to return correct values for each call
    path.join
      .mockReturnValueOnce("./html/subFolder") // For navigating into subFolder
      .mockReturnValueOnce("./html/subFolder/file1.html"); // For the file path

    // Mock fs.lstatSync to first return a directory, then a file
    fs.lstatSync
      .mockReturnValueOnce({ isDirectory: () => true }) // subFolder is a directory
      .mockReturnValueOnce({ isDirectory: () => false }); // file1.html is a file

    indexer = new Indexer([], fs);
    const response = indexer.findHtml("./html");

    // Log for debugging
    console.log(response);

    // Assertion
    expect(response).toEqual(["subFolder/file1.html"]);
  });



  it("Finds files in a subdirectory", () => {
    // checks if folder exists
    fs.existsSync.mockReturnValue(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValueOnce(["file", "subFolder"]);

    // joins name of file with path
    path.join.mockReturnValueOnce("./html/file.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValueOnce({ isDirectory: () => false });

    // joins name of file with path
    path.join.mockReturnValueOnce("./html/subFolder");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValueOnce({ isDirectory: () => true });

    // returns names of all files in folder
    fs.readdirSync.mockReturnValueOnce(["file2.html"]);

    // joins name of file with path
    path.join.mockReturnValueOnce("./html/subFolder/file2.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValueOnce({ isDirectory: () => false });

    indexer = new Indexer([], fs);
    response = indexer.findHtml("./html");
    expect(response).toEqual(["file.html", "subFolder/file2.html"]);
  });

});

describe("isHtml() decides if file is a .html file returns true or false", ()=>{
   let indexer;

   beforeEach(() => {
     indexer = new Indexer([]);
   });

  it("return true when passed a html fileName with.html and false when without", ()=>{

    expect(indexer.isHtml("file.html")).toEqual(true);
    expect(indexer.isHtml("file.htm")).toEqual(false);
    expect(indexer.isHtml("file")).toEqual(false);

  })
})

describe("runs program when passed run command", ()=>{
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("runs the main() function when passed the argv 'run' ", async ()=>{
    const mockArgs = [
      "/usr/local/bin/node",
      "/Users/websiteIndexer",
      "Run"
    ];

    const mockLog = jest.spyOn(console, 'log');

    await new Indexer(mockArgs);
    expect(mockLog).toHaveBeenCalledWith('Running ...')
  })

  it("doesn't run the main() function when no argument passed", async () => {
    const mockArgs = ["/usr/local/bin/node", "/Users/websiteIndexer"];

    const mockLog = jest.spyOn(console, "log");

    await new Indexer(mockArgs);
    expect(mockLog).toHaveBeenCalledTimes(0);
  });

  it("handles empty array as arv", async () => {
    const mockLog = jest.spyOn(console, "log");

    await new Indexer([]);
    expect(mockLog).toHaveBeenCalledTimes(0);
  });
})

describe("removeDuplicates removes any objects with duplicate content from an array", () => {
  let indexer;

  beforeEach(()=>{
    indexer = new Indexer([]);
  })

  it("it returns an empty array when passed empty array", () => {
    expect(indexer.removeDuplicates([])).toEqual([]);
  });

  it("it returns an empty array when passed empty object", () => {
    expect(indexer.removeDuplicates([{}])).toEqual([{}]);
  });

  it("it removes objects with same content", () => {
    const obj = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj }, { c: "Unique Value" }];

    const results = array.slice(1);

    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes same duplicate objects with same content with 3 occurrences", () => {
    const obj = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj }, { ...obj }, { c: "Unique Value" }];

    const results = [{ ...obj }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes same duplicate objects with same content with 3 occurrences with 1 at end of arr", () => {
    const obj = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj }, { c: "Unique Value" }, { ...obj }];

    const results = [{ ...obj }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes 2 sets of duplicates", () => {
    const obj = { c: "Player Portal" };
    const obj2 = { c: "Some Thing" };
    const array = [
      { ...obj },
      { ...obj2 },
      { c: "Unique Value" },
      { ...obj },
      { ...obj2 },
    ];

    const results = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes 2 sets of duplicates with more occurrences", () => {
    const obj = { c: "Player Portal" };
    const obj2 = { c: "Some Thing" };
    const array = [
      { ...obj },
      { ...obj },
      { ...obj },
      { ...obj2 },
      { ...obj },
      { ...obj2 },
      { c: "Unique Value" },
      { ...obj },
      { ...obj2 },
      { ...obj2 },
    ];

    const results = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it removes multiply sets of duplicates with more occurrences", () => {
    const obj = { c: "Player Portal" };
    const obj2 = { c: "Some Thing" };
    const obj3 = { c: "Some Thing else" };
    const array = [
      { ...obj },
      { ...obj3 },
      { ...obj },
      { ...obj2 },
      { ...obj3 },
      { ...obj2 },
      { c: "Unique Value" },
      { ...obj3 },
      { ...obj2 },
      { ...obj2 },
    ];

    const results = [
      { ...obj },
      { ...obj3 },
      { ...obj2 },
      { c: "Unique Value" },
    ];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });

  it("it doesn't remove similar content that isn't exact same", () => {
    const obj = { c: " Player Portal " };
    const obj2 = { c: "Player Portal" };
    const array = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }, { ...obj2 }];

    const results = [{ ...obj }, { ...obj2 }, { c: "Unique Value" }];
    expect(indexer.removeDuplicates(array).length).toEqual(results.length);
    expect(indexer.removeDuplicates(array)).toEqual(results);
  });
});
