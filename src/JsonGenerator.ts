const path = require("path");
const processmd = require("processmd").default;
const defaultOptions = require("processmd/defaultOptions.js");

import { MarkdownDownloader } from "./MarkdownDownloader";
import { Options, OptionsUtil } from "./Options";

export class JsonGenerator {
  public static async generate(options?: Options) {
    options = OptionsUtil.init(options);
    await MarkdownDownloader.download(options);

    const processMDOptions = this.initProcessMDOptions(options);
    processmd(processMDOptions, (err, data) => {
      if (err) {
        process.stderr.write(JSON.stringify(err));
      }
      if (processMDOptions.stdout) {
        process.stdout.write(JSON.stringify(data, null, 2));
      }
    });
  }

  static initProcessMDOptions(options: Options) {
    const processMDOptions = Object.assign({}, defaultOptions);
    processMDOptions.files = path.resolve(
      options.contentsDir,
      options.mdDir,
      "**/*.md"
    );
    processMDOptions.outputDir = path.resolve(
      options.contentsDir,
      options.jsonDir
    );
    processMDOptions.markdownOptions.html = true;
    processMDOptions.summaryOutput = path.resolve(
      processMDOptions.outputDir,
      "summary.json"
    );
    return processMDOptions;
  }
}
