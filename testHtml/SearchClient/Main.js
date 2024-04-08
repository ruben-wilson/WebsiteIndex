import ClassFactory from "./src/ClassFactory.js";
// import {index, preview} from "../LunrTestOutput.js"
import { index, preview } from "../../test/mockHtml/LunrTestOutput.js";

const classFactory = new ClassFactory(lunr, index, preview);

const resultFinder = classFactory.createResultFinder(document)

const searchRunner = classFactory.createSearchRunner(
  document,
  "searchResults",
  "queryInput"
);

window.onload = () => {
  // finds results from an excuted search
  resultFinder.run()
  // executes a user search
  searchRunner.run();
}



