import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { ImageDownloader, QiitaRequest } from "./index.js";
import { Options } from "./Options.js";

export class MarkdownDownloader {
  public static async download(options: Options) {
    const require = createRequire(import.meta.url);
    const tokenJson = require(options.token);

    QiitaRequest.token = tokenJson.token;

    const user = await QiitaRequest.getAuthenticatedUser();
    return await MarkdownDownloader.getItems(user.items_count, options);
  }

  /**
   * 記事リストを取得する。
   * @param itemsCount
   * @param options
   */
  static async getItems(itemsCount: number, options: Options) {
    const MAX_ITEM_PER_PAGE = 100;
    const pageNum = Math.ceil(itemsCount / MAX_ITEM_PER_PAGE);

    const items = [];
    for (let i = 1; i <= pageNum; i++) {
      const result = await QiitaRequest.listAuthenticatedUserItems({
        page: i.toString(),
        per_page: MAX_ITEM_PER_PAGE.toString(),
      });

      for (let item of result) {
        items.push(await this.reformatItem(item, options));
      }
    }
    return items;
  }

  /**
   * 記事保存用のディレクトリを作成する。
   */
  static makeDir(options: Options): void {
    //TODO 非同期化
    const option = {
      recursive: true,
    };
    fs.mkdirSync(path.resolve(options.contentsDir, options.jsonDir), option);
  }

  /**
   * 記事本文を整形する。
   * Qiitaサーバーに保存された画像はローカルに取得、リンクを書き換える。
   * @param item
   * @param options
   */
  static async makeBody(item, options: Options) {
    let body = await ImageDownloader.getMarkdownImages(
      item.body,
      options.staticDir,
      options.imgDir
    );
    body = await ImageDownloader.getHTMLImages(
      body,
      options.staticDir,
      options.imgDir
    );
    return body;
  }

  static async reformatItem(item, options: Options) {
    this.makeDir(options);
    const bodyContent = await this.makeBody(item, options);
    return {
      title: item.title,
      created_at: item.created_at,
      id: item.id,
      categories: MarkdownDownloader.getTagArray(item.tags),
      bodyContent,
    };
  }

  /**
   * タグの名称のみを配列化する。
   * @param tags
   */
  static getTagArray(tags) {
    return tags.map((val) => {
      return val.name;
    });
  }
}
