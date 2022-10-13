import { format } from "date-fns";
import fs from "fs/promises";
import path from "path";

import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import retextStringify from "retext-stringify";
import strip from "strip-markdown";
import { unified } from "unified";

import { MarkdownDownloader } from "./index.js";
import { Options, OptionsUtil } from "./Options.js";

export class JsonGenerator {
  public static async generate(options?: Options) {
    options = OptionsUtil.init(options);
    const items = await MarkdownDownloader.download(options);

    for (let item of items) {
      item.bodyHTML = await this.convertToHTML(item.bodyContent);
      item.preview = await this.convertToPreview(item.bodyContent);
      await fs.writeFile(
        this.getFilePath(item, options),
        JSON.stringify(item, null, 2)
      );
    }

    const summary = { flatMap: {}, sourceFileArray: [] };
    for (let item of items) {
      const filePath = path.relative(
        process.cwd(),
        this.getFilePath(item, options)
      );
      summary.flatMap[filePath] = {
        title: item.title,
        created_at: item.created_at,
        categories: item.categories,
        preview: item.preview,
      };
      summary.sourceFileArray.push(filePath);
    }

    await fs.writeFile(
      path.resolve(options.contentsDir, options.jsonDir, `summary.json`),
      JSON.stringify(summary, null, 2)
    );
  }

  private static getFilePath(item, options?: Options): string {
    return path.resolve(
      options.contentsDir,
      options.jsonDir,
      `${format(new Date(item.created_at), "yyyy-MM-dd-HHmmss_")}${
        item.id
      }.json`
    );
  }

  static async convertToHTML(body: string) {
    const result = await unified()
      .use(remarkParse) // markdown -> mdast の変換
      .use(remarkRehype) // mdast -> hast の変換
      .use(rehypeHighlight, { ignoreMissing: true })
      .use(rehypeStringify) // hast -> html の変換
      .process(body); // 実行
    return result.value;
  }

  static async convertToPreview(body: string) {
    const result = await unified()
      .use(remarkParse) // markdown -> mdast の変換
      .use(strip)
      .use(retextStringify)
      .process(body); // 実行
    return result.value.toString().substring(0, 600);
  }
}
