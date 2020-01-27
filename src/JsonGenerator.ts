import { MarkdownDownloader } from "./MarkdownDownloader";
const processmd = require("processmd").default;
const defaultOptions = require("processmd/defaultOptions.js");

export class JsonGenerator {
  public static async generate() {
    await MarkdownDownloader.download();

    const options = Object.assign({}, defaultOptions);
    options.files = "contents/md/**/*.md";
    options.outputDir = "contents/json";
    options.preview = 1000;
    options.markdownOptions.html = true;
    options.summaryOutput = "contents/json/summary.json";

    processmd(options, (err, data) => {
      if (err) {
        process.stderr.write(JSON.stringify(err));
      }
      if (options.stdout) {
        // Indent JSON 2 spaces.
        process.stdout.write(JSON.stringify(data, null, 2));
      }
    });
  }
}
