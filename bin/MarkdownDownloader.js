"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownDownloader = void 0;
const fs = require("fs");
const path = require("path");
const Qiita = require("qiita-js");
const date_fns_1 = require("date-fns");
const ImageDownloader_1 = require("./ImageDownloader");
class MarkdownDownloader {
    static download(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenJson = require(options.token);
            Qiita.setToken(tokenJson.token);
            Qiita.setEndpoint("https://qiita.com");
            const user = yield Qiita.Resources.AuthenticatedUser.get_authenticated_user();
            yield MarkdownDownloader.getItems(user.items_count, options);
        });
    }
    /**
     * 記事リストを取得する。
     * @param itemsCount
     * @param options
     */
    static getItems(itemsCount, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const MAX_ITEM_PER_PAGE = 100;
            const pageNum = Math.ceil(itemsCount / MAX_ITEM_PER_PAGE);
            for (let i = 1; i <= pageNum; i++) {
                const result = yield Qiita.Resources.Item.list_authenticated_user_items({
                    page: i,
                    per_page: MAX_ITEM_PER_PAGE,
                });
                for (let item of result) {
                    yield this.reformatItem(item, options);
                }
            }
        });
    }
    /**
     * 記事保存用のディレクトリを作成する。
     */
    static makeDir(options) {
        //TODO 非同期化
        const option = {
            recursive: true,
        };
        fs.mkdirSync(path.resolve(options.contentsDir, options.mdDir), option);
        fs.mkdirSync(path.resolve(options.contentsDir, options.jsonDir), option);
    }
    /**
     * 記事本文を整形する。
     * Qiitaサーバーに保存された画像はローカルに取得、リンクを書き換える。
     * @param item
     */
    static makeBody(item, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = yield ImageDownloader_1.ImageDownloader.getMarkdownImages(item.body, options.staticDir, options.imgDir);
            body = yield ImageDownloader_1.ImageDownloader.getHTMLImages(body, options.staticDir, options.imgDir);
            return body;
        });
    }
    static reformatItem(item, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.makeDir(options);
            const body = yield this.makeBody(item, options);
            const date = new Date(item.created_at);
            const tags = MarkdownDownloader.getTagArray(item.tags);
            const header = `---
title: "${item.title}"
created_at: ${item.created_at}
categories: [${tags.join(", ")}]
---

`;
            const filePath = path.resolve(options.contentsDir, options.mdDir, `${(0, date_fns_1.format)(date, "yyyy-MM-dd-HHmmss_")}${item.id}.md`);
            fs.writeFileSync(filePath, header + body);
        });
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
exports.MarkdownDownloader = MarkdownDownloader;
