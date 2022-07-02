const fs = require("fs");
const path = require("path");
const Qiita = require("qiita-js");

import {format} from "date-fns";
import {ImageDownloader} from "./ImageDownloader";
import {Options} from "./Options";

export class MarkdownDownloader {
  public static async download(options: Options) {
    const tokenJson = require(options.token);
    Qiita.setToken(tokenJson.token);
    Qiita.setEndpoint("https://qiita.com");

    const user = await Qiita.Resources.AuthenticatedUser.get_authenticated_user();
    await MarkdownDownloader.getItems(user.items_count, options);
  }

  /**
   * 記事リストを取得する。
   * @param itemsCount
   * @param options
   */
  static async getItems(itemsCount: number, options: Options) {
    const MAX_ITEM_PER_PAGE = 100;
    const pageNum = Math.ceil(itemsCount / MAX_ITEM_PER_PAGE);

    for (let i = 1; i <= pageNum; i++) {
      const result = await Qiita.Resources.Item.list_authenticated_user_items({
        page: i,
        per_page: MAX_ITEM_PER_PAGE
      });

      for (let item of result) {
        await this.reformatItem(item, options);
      }
    }
  }

  /**
   * 記事保存用のディレクトリを作成する。
   */
  static makeDir(options: Options): void {
    //TODO 非同期化
    const option = {
      recursive: true
    };
    fs.mkdirSync(path.resolve(options.contentsDir, options.mdDir), option);
    fs.mkdirSync(path.resolve(options.contentsDir, options.jsonDir), option);
    fs.mkdirSync(path.resolve(options.imgDir), option);
  }

  /**
   * 記事本文を整形する。
   * Qiitaサーバーに保存された画像はローカルに取得、リンクを書き換える。
   * @param item
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
    const body = await this.makeBody(item, options);
    const date = new Date(item.created_at);
    const tags = MarkdownDownloader.getTagArray(item.tags);

    const header = `---
title: "${item.title}"
created_at: ${item.created_at}
categories: [${tags.join(", ")}]
---

`;

    const filePath = path.resolve(
      options.contentsDir,
      options.mdDir,
      `${format(date, "yyyy-MM-dd-HHmmss_")}${item.id}.md`
    );
    fs.writeFileSync(filePath, header + body);
  }

  /**
   * タグの名称のみを配列化する。
   * @param tags
   */
  static getTagArray(tags) {
    return tags.map(val => {
      return val.name;
    });
  }
}
