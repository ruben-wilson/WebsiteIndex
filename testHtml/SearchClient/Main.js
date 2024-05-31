import ClassFactory from "./src/ClassFactory.js";
import { index, preview } from "../playhtml/LunrIndex.js";

const classFactory = new ClassFactory(lunr, index, preview);

const resultFinder = classFactory.createResultFinder(document);

const searchRunner = classFactory.createSearchRunner(
  document,
  "searchResults",
  "queryInput", 
  "search",
  "buttonClear"
);

window.onload = () => {
  // finds results from an excuted search
  resultFinder.run();
  // executes a user's search
  searchRunner.run();
};
