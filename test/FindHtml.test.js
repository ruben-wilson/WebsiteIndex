const { Indexer } = require("../websiteIndexer.js");

describe("findHtml() finds all file names which end with .html", () => {
  jest.mock("fs");
  jest.mock("path");

  const fs = require("fs");
  const path = require("path");

  let indexer;

  beforeEach(() => {
    jest.restoreAllMocks();

    indexer = new Indexer(fs, path);
  });

  it("Finds file in directory", () => {
    // checks if folder exists
    fs.existsSync.mockReturnValue(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValue(["file1.html"]);

    // joins name of file with path
    path.join.mockReturnValue("./html/file1.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValue({ isDirectory: () => false });

    expect(indexer.findHtml("./html")).toEqual(["file1.html"]);
  });

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

    expect(indexer.findHtml("./html")).toEqual([
      "file1.html",
      "file2.html",
      "file3.html",
    ]);
  });

  it("Finds file in subdirectory", () => {
    // checks if folder exists
    fs.existsSync.mockReturnValue(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValueOnce(["subFolder"]);

    // joins name of file with path
    path.join.mockReturnValueOnce("./html/subFolder");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValueOnce({ isDirectory: () => true });

    // calls self with its self with sub dir as argument
    // checks if folder exists
    fs.existsSync.mockReturnValueOnce(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValueOnce(["file1.html"]);

    // joins name of file with path
    path.join.mockReturnValueOnce("/subFolder/file1.html");
    // returns an object with detials about the file/dir object
    fs.lstatSync.mockReturnValueOnce({ isDirectory: () => false });

    path.join.mockReturnValueOnce("subFolder/file1.html");

    response = indexer.findHtml("./html");
    expect(response).toEqual(["subFolder/file1.html"]);
  });

  it("Finds files in a subdirectory", () => {
    // checks if folder exists
    fs.existsSync.mockReturnValue(true);
    // returns names of all files in folder
    fs.readdirSync.mockReturnValueOnce(["file.html", "subFolder"]);

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

    path.join.mockReturnValueOnce("subFolder/file2.html");

    response = indexer.findHtml("./html");
    expect(response).toEqual(["file.html", "subFolder/file2.html"]);
  });
});
