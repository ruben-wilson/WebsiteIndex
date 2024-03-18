class DataProcessor {
  buildIndex(docs) {
    const searchFields = this.searchFields;

    let idx = this.lunr(function () {
      this.ref("id");
      this.metadataWhitelist = ["position"];

      for (let i = 0; i < searchFields.length; i++) {
        this.field(searchFields[i].slice(0, 1));
      }

      docs.forEach((doc) => {
        this.add(doc);
      }, this);
    });

    return idx;
  }

  buildPreviews(docs) {
    let result = {};
    for (const doc of docs) {
      let preview = doc["c"];
      if (preview.length > this.maxPreviewChars) {
        preview = preview.slice(0, this.maxPreviewChars) + " ...";
      }

      result[doc["id"]] = {
        t: doc["t"],
        c: preview,
        l: doc["link"],
        e: doc["e"],
        w: doc["p"],
      };
    }
    return result;
  }

  buildDocumentObj(idx, previews) {
    return (
      "const LUNR_DATA = " +
      JSON.stringify(idx) +
      ";\n" +
      "const PREVIEW_LOOKUP = " +
      JSON.stringify(previews) +
      ";"
    );
  }

  errorHandler(err) {
    if (err) {
      this.error = err;
    }
  }

  async writeToFile(content) {
    const filePath = path.join(this.htmlFolder, "LunrTestOutput.js");
    await this.fs.writeFile(filePath, content, this.errorHandler);
    return this.error;
  }
}

module.exports = {
  DataProcessor,
};
