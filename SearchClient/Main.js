
import ClassFactory from "./src/ClassFactory.js";
import { index, previews } from '../lunrIndex.js';


const classFactory = new ClassFactory(lunr, index, previews);
const searchRunner = classFactory.createSearchRunner(document, "queryInput");

searchRunner.run();