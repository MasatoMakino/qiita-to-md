import path from "path";
import ProcessMD from "processmd";
import defaultOptions from "processmd/defaultOptions.js";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { unified } from "unified";
import { MarkdownDownloader } from "./index.js";
import { Options, OptionsUtil } from "./Options.js";

export class JsonGenerator {
  public static async generate(options?: Options) {
    options = OptionsUtil.init(options);
    await MarkdownDownloader.download(options);

    const processMDOptions = this.initProcessMDOptions(options);
    ProcessMD.default(processMDOptions, (err, data) => {
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
    processMDOptions.files = path.join(
      options.contentsDir,
      options.mdDir,
      "**/*.md"
    );
    processMDOptions.outputDir = path.join(
      options.contentsDir,
      options.jsonDir
    );
    processMDOptions.preview = 600;
    processMDOptions.previewDelimiter = "。";
    processMDOptions.markdownOptions.html = true;
    processMDOptions.summaryOutput = path.join(
      processMDOptions.outputDir,
      "summary.json"
    );

    processMDOptions.markdownRenderer = (str) => {
      const result = unified()
        .use(remarkParse) // markdown -> mdast の変換
        .use(remarkRehype) // mdast -> hast の変換
        .use(rehypeHighlight, { ignoreMissing: true })
        .use(rehypeStringify) // hast -> html の変換
        .processSync(str); // 実行
      return result.value;
    };

    return processMDOptions;
  }
}
