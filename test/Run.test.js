
const { Indexer } = require("../websiteIndexer.js");


describe("runs program when passed run command", () => {
  jest.mock("fs");

  const fs = require("fs");
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("runs the main() function when passed the argv 'run'", async () => {
    const mockArgs = ["/usr/local/bin/node", "/Users/websiteIndexer", "Run"];
    const mockLog = jest.spyOn(console, "log");

    fs.existsSync.mockReturnValue(false);
    jest.spyOn(fs, 'writeFile').mockReturnValue(null)
  

    await new Indexer(mockArgs, fs);

    expect(mockLog).toHaveBeenCalledWith("Running ...");
    expect(mockLog).toHaveBeenCalledTimes(3);
  });

  it("doesn't run the main() function when no argument passed", () => {
    const mockArgs = ["/usr/local/bin/node", "/Users/websiteIndexer"];

    const mockLog = jest.spyOn(console, "log");

    new Indexer(mockArgs, fs);

    expect(mockLog).not.toHaveBeenCalled();
  });

  it("handles empty array as argv", () => {
    const mockLog = jest.spyOn(console, "log");

    new Indexer([], fs);

    expect(mockLog).not.toHaveBeenCalled();
  });
});
