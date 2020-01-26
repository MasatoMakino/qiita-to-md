const fs = require("fs");
const path = require("path");

import { format } from "date-fns";
const Qiita = require("qiita-js");
const tokenJson = require("../.qiita_token.json");
import { ImageDownloader } from "./ImageDownloader";

export class MarkdownDownloader {
  public static download() {
    Qiita.setToken(tokenJson.token);
    Qiita.setEndpoint("https://qiita.com");

    const user = Qiita.Resources.AuthenticatedUser.get_authenticated_user().then(
      user => {
        getItems(user.items_count);
      }
    );

    const MAX_ITEM_PER_PAGE = 100;
    const getItems = itemsCount => {
      const pageNum = Math.ceil(itemsCount / MAX_ITEM_PER_PAGE);

      for (let i = 1; i <= pageNum; i++) {
        Qiita.Resources.Item.list_authenticated_user_items({
          page: i,
          per_page: MAX_ITEM_PER_PAGE
        }).then(result => {
          result.forEach(item => {
            reformatItem(item);
          });
        });
      }
    };

    const contentsDir = "./contents";
    const jsonDir = "json";
    const mdDir = "md";

    const staticRoot = "./static";
    const imgDir = "img/post";

    const reformatItem = item => {
      fs.mkdirSync(path.resolve(contentsDir, mdDir), { recursive: true });
      fs.mkdirSync(path.resolve(contentsDir, jsonDir), { recursive: true });
      fs.mkdirSync(path.resolve(staticRoot, imgDir), { recursive: true });

      let body = ImageDownloader.getMarkdownImages(
        item.body,
        staticRoot,
        imgDir
      );
      body = ImageDownloader.getHTMLImages(body, staticRoot, imgDir);

      const date = new Date(item.created_at);
      const tags = MarkdownDownloader.getTagArray(item.tags);

      const header = `---
title: "${item.title}"
created_at: ${item.created_at}
categories: [${tags.join(", ")}]
---

`;

      const filePath = path.resolve(
        contentsDir,
        mdDir,
        `${format(date, "yyyy-MM-dd-HHmmss_")}${item.id}.md`
      );
      fs.writeFileSync(filePath, header + body);
    };
  }

  static getTagArray = tags => {
    return tags.map(val => {
      return val.name;
    });
  };
}
