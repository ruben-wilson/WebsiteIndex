// const { Indexer } = require("../src/websiteInd.js"); 
const fs = require("fs").promises;
const path = require("path");

// Mock fs and path
jest.mock("fs", () => {
  return {
    promises: {
      writeFile: jest.fn(),
    },
  };
});

jest.mock("path", () => {
  return {
    join: jest.fn(),
  };
});

describe("writeToFile", () => {
  let indexer;

  beforeEach(() => {
    jest.restoreAllMocks();

    indexer = new Indexer(fs, path);
  });


  xtest("writeToFile writes content to the correct file and handles no error", async () => {
    // Set up path.join to return a specific fake path
    path.join.mockReturnValue("/fake/htmlFolder/LunrTestOutput.js");

    // Mock fs.writeFile to resolve without an error
    fs.writeFile.mockResolvedValue();

    const content = "test content";
    const error = await indexer.writeToFile(content);


    expect(error).toBe(false);
    expect(indexer.error).toBe(false);
  });

  xtest("writeToFile handles and logs an error", async () => {
    // Mock an error to be thrown by fs.writeFile

    fs.writeFile.mockReturnValue(true);

    await indexer.errorHandler(true);

    // Check if errorHandler was called with the correct error
    expect(indexer.error).toEqual(true);
  });
});
