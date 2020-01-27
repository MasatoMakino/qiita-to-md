import { Options, OptionsUtil } from "./Options";
import { MarkdownDownloader } from "./MarkdownDownloader";
const processmd = require("processmd").default;
const defaultOptions = require("processmd/defaultOptions.js");

export class JsonGenerator {
  public static async generate(options?: Options) {
    options = OptionsUtil.init(options);
    await MarkdownDownloader.download(options);

    const processMDOptions = this.initProcessMDOptions();
    processmd(processMDOptions, (err, data) => {
      if (err) {
        process.stderr.write(JSON.stringify(err));
      }
      if (processMDOptions.stdout) {
        process.stdout.write(JSON.stringify(data, null, 2));
      }
    });
  }

  static initProcessMDOptions() {
    const processMDOptions = Object.assign({}, defaultOptions);
    processMDOptions.files = "contents/md/**/*.md";
    processMDOptions.outputDir = "contents/json";
    processMDOptions.preview = 1000;
    processMDOptions.markdownOptions.html = true;
    processMDOptions.summaryOutput = "contents/json/summary.json";
    return processMDOptions;
  }
}
