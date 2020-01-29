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
const fs = require("fs");
const path = require("path");
const request = require("request");
class ImageDownloader {
    /**
     * markdownに記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
     * @param markdown
     * @param imgDir
     */
    static getMarkdownImages(markdown, staticDir, imgDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = /(\!\[.*\]\()(https:\/\/qiita-image-store.*.com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))(\))/g;
            return yield this.convertImageLink(regex, markdown, staticDir, imgDir);
        });
    }
    /**
     * <img>タグで記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
     * @param markdown
     * @param imgDir
     */
    static getHTMLImages(markdown, staticDir, imgDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = /(<img\s*src=\s*")(https:\/\/qiita-image-store.*com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))("[^<]*>)/g;
            return yield this.convertImageLink(regex, markdown, staticDir, imgDir);
        });
    }
    /**
     * 画像ファイルをダウンロードし、画像リンクを書き換える
     * @param regex
     * @param markdown
     * @param staticDir
     * @param imgDir
     */
    static convertImageLink(regex, markdown, staticDir, imgDir) {
        const founds = markdown.matchAll(regex);
        for (const found of founds) {
            const url = found[2];
            const fileName = found[3];
            ImageDownloader.downloadImage(url, staticDir, imgDir, fileName);
        }
        markdown = markdown.replace(regex, (match, p1, p2, p3, p4, p5, offset, string) => {
            return `${p1}/${imgDir}/${p3}${p5}`;
        });
        return markdown;
    }
    /**
     * 画像をダウンロードし、保存する
     * @param url
     * @param staticDir
     * @param imgDir
     * @param fileName
     */
    static downloadImage(url, staticDir, imgDir, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request({ method: "GET", url: url, encoding: null }, function (error, response, imgBody) {
                    if (error || response.statusCode !== 200) {
                        return reject();
                    }
                    fs.writeFile(path.resolve(staticDir, imgDir, fileName), imgBody, "binary", err => {
                        if (err) {
                            console.log(err);
                        }
                        return resolve();
                    });
                });
            });
        });
    }
}
exports.ImageDownloader = ImageDownloader;
