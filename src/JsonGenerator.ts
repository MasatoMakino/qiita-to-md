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
import { RemarkLinkCardPlugin } from "./plugin/RemarkLinkCardPlugin.js";
import { RemarkNotePlugin } from "./plugin/RemarkNotePlugin.js";

export class JsonGenerator {
  public static async generate(options?: Options) {
    options = OptionsUtil.init(options);
    const items = await MarkdownDownloader.download(options);

    //記事jsonの生成と保存
    for (let item of items) {
      item.bodyHtml = await this.convertToHTML(item.bodyContent);
      item.preview = await this.convertToPreview(item.bodyContent);
      await fs.writeFile(
        this.getFilePath(item, options),
        JSON.stringify(item, null, 2)
      );
    }

    //記事オブジェクトからサマリーjsonの生成
    const summary = { fileMap: {}, sourceFileArray: [] };
    for (let item of items) {
      const filePath = path.relative(
        process.cwd(),
        this.getFilePath(item, options)
      );
      summary.fileMap[filePath] = {
        title: item.title,
        created_at: item.created_at,
        categories: item.categories,
        preview: item.preview,
        dir: path.join(options.contentsDir, options.jsonDir),
        base: this.getFileBase(item),
      };
      summary.sourceFileArray.unshift(filePath);
    }

    //サマリーの保存
    await fs.writeFile(
      path.resolve(options.contentsDir, options.jsonDir, `summary.json`),
      JSON.stringify(summary, null, 2)
    );
  }

  /**
   * 記事情報からjsonファイルの保存パスを生成する
   * @param item
   * @param options
   * @private
   */
  private static getFilePath(item, options?: Options): string {
    return path.resolve(
      options.contentsDir,
      options.jsonDir,
      this.getFileBase(item)
    );
  }

  /**
   * 記事作成日付とIDからユニークなファイル名を生成する
   * @param item
   * @private
   */
  private static getFileBase(item): string {
    return `${format(new Date(item.created_at), "yyyy-MM-dd-HHmmss_")}${
      item.id
    }.json`;
  }

  /**
   * マークダウン本文からHTMLを生成する
   * @param body
   */
  public static async convertToHTML(body: string) {
    // @ts-ignore
    const result = await unified()
      .use(remarkParse) // markdown -> mdast の変換
      .use(RemarkNotePlugin.plugin)
      // .use(remarkLinkCard)
      .use(RemarkLinkCardPlugin.plugin)
      .use(remarkRehype, {
        handlers: {
          note: RemarkNotePlugin.rehypeNoteHandler as any,
          LinkCard: RemarkLinkCardPlugin.rehypeHandler as any,
        },
        allowDangerousHtml: true,
      }) // mdast -> hast の変換
      .use(rehypeHighlight, { ignoreMissing: true })
      .use(rehypeStringify, { allowDangerousHtml: true }) // hast -> html の変換
      .process(body); // 実行

    return result.value;
  }

  /**
   * マークダウン本文からプレビュー用プレーンテキストを生成する
   * @param body
   */
  static async convertToPreview(body: string) {
    const result = await unified()
      .use(remarkParse) // markdown -> mdast の変換
      .use(strip)
      .use(retextStringify)
      .process(body); // 実行
    return result.value.toString().substring(0, 600);
  }
}
