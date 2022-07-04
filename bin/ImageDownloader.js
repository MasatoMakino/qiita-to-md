"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ImageDownloader = void 0;
const fs = require("fs");
const path = require("path");
const https = __importStar(require("https"));
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
                https.get(url, (response) => {
                    if (response.statusCode === 200) {
                        const filePath = path.resolve(staticDir, imgDir, fileName);
                        fs.mkdirSync(path.dirname(filePath), { recursive: true });
                        response
                            .pipe(fs.createWriteStream(filePath))
                            .on("error", reject)
                            .once("close", () => {
                            resolve(filePath);
                        });
                    }
                    else {
                        response.resume();
                        reject(new Error(`Image Download Failed With : ${response.statusCode}`));
                    }
                });
            });
        });
    }
}
exports.ImageDownloader = ImageDownloader;
