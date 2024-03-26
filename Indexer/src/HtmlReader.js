class HtmlReader {

  constructor(fs, path, cheerio, exclude_files) {
    this.fs = fs;
    this.path = path;
    this.cheerio = cheerio;
    this.exclude_files = exclude_files; 
  }

  isHtml(filename) {
    const lower = filename.toLowerCase();
    return lower.endsWith(".html");
  }

  findHtml(folder, output) {
    
    if (!this.fs.existsSync(folder)) {
      return output.createErrLog(`Could not find folder: + ${folder}`);
    }

    let files = this.fs.readdirSync(folder);
    let html = [];

    for (const file of files) {
      let filename = this.path.join(folder, file);
      let stat = this.fs.lstatSync(filename);

      if (stat.isDirectory()) {
        let recursed = this.findHtml(filename);

        recursed.forEach((subFile, index) => {
          recursed[index] = this.path.join(file, subFile).replace(/\\/g, "/");
        });

        html.push.apply(html, recursed);
      } else if (this.isHtml(filename) && !this.exclude_files.includes(file)) {
        html.push(file);
      }
    }
    return html;
  }

  removeDuplicates(arr) {
    for (let i = 0; i < arr.length; i++) {
      let content = arr[i].c;

      for (let j = i + 1; j < arr.length; j++) {
        if (content == arr[j].c) {
          arr.splice(j, 1);
          j -= 1;
        }
      }
    }
    return arr;
  }

  createLink(file, elId){
    let dataToSend = { trgEl: elId };
    let linkParams = new URLSearchParams(dataToSend).toString();
    return `${file}?${linkParams}`;

  }

  readHtml(projectName, root, file, fileId) {
    let filename = this.path.join(root, file),
      txt = this.fs.readFileSync(filename).toString(),
      $ = this.cheerio.load(txt),
      title = $("title").text();
    if (typeof title == "undefined") title = file;

    // traverse through cheerio object to find all text content
    let results = [];
    let i = 0;
    const findTextContent = (element) => {
      if (element.type === "text") {

        if (
          (element.data.trim().length !== 0) &
          (element.parent.name !== "script") &
          (element.parent.name !== "style") &
          (element.parent.name !== "title") &
          (element.parent.name !== "a")
        ) {

          const link = this.createLink(file, element.parent.attribs.id);
          results.push({
            id: [fileId, i],
            link: link,
            t: title,
            c: element.data.trim(),
            e: element.parent.name || "N/A",
            p: projectName
          });
          i++;
        }
      }

      if (element.children) {
        element.children.forEach((child) =>
          findTextContent(child, results, file, title, i)
        );
      }
      return results;
    };

    results = findTextContent($.root()[0]);
    // remove duplicate els
    const cleanResults = this.removeDuplicates(results);
    return cleanResults;
  }
}

module.exports = {
  HtmlReader
}