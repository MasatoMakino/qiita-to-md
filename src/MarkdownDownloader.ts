const fs = require("fs");
const path = require("path");

import { format } from "date-fns";
import { Options } from "./Options";
const Qiita = require("qiita-js");
const tokenJson = require("../.qiita_token.json");
import { ImageDownloader } from "./ImageDownloader";

export class MarkdownDownloader {
  static contentsDir = "./contents";
  static jsonDir = "json";
  static mdDir = "md";
  static staticRoot = "./static";
  static imgDir = "img/post";

  public static async download(options: Options) {
    Qiita.setToken(tokenJson.token);
    Qiita.setEndpoint("https://qiita.com");
    Qiita.Resources.AuthenticatedUser.get_authenticated_user().then(
      async user => {
        await MarkdownDownloader.getItems(user.items_count);
      }
    );
    console.log("downloaded md");
  }

  /**
   * 記事リストを取得する。
   * @param itemsCount
   */
  static async getItems(itemsCount: number) {
    const MAX_ITEM_PER_PAGE = 100;
    const pageNum = Math.ceil(itemsCount / MAX_ITEM_PER_PAGE);

    for (let i = 1; i <= pageNum; i++) {
      Qiita.Resources.Item.list_authenticated_user_items({
        page: i,
        per_page: MAX_ITEM_PER_PAGE
      }).then(result => {
        result.forEach(async item => {
          await MarkdownDownloader.reformatItem(item);
        });
      });
    }
  }

  /**
   * 記事保存用のディレクトリを作成する。
   */
  static makeDir(): void {
    //TODO 非同期化
    const option = {
      recursive: true
    };
    fs.mkdirSync(path.resolve(this.contentsDir, this.mdDir), option);
    fs.mkdirSync(path.resolve(this.contentsDir, this.jsonDir), option);
    fs.mkdirSync(path.resolve(this.staticRoot, this.imgDir), option);
  }

  /**
   * 記事本文を整形する。
   * Qiitaサーバーに保存された画像はローカルに取得、リンクを書き換える。
   * @param item
   */
  static async makeBody(item) {
    let body = await ImageDownloader.getMarkdownImages(
      item.body,
      this.staticRoot,
      this.imgDir
    );
    body = await ImageDownloader.getHTMLImages(
      body,
      this.staticRoot,
      this.imgDir
    );
    return body;
  }

  static async reformatItem(item) {
    this.makeDir();
    const body = await this.makeBody(item);
    const date = new Date(item.created_at);
    const tags = MarkdownDownloader.getTagArray(item.tags);

    const header = `---
title: "${item.title}"
created_at: ${item.created_at}
categories: [${tags.join(", ")}]
---

`;

    const filePath = path.resolve(
      MarkdownDownloader.contentsDir,
      MarkdownDownloader.mdDir,
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
