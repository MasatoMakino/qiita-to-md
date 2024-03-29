import fs from "fs";
import * as https from "https";
import path from "path";

export class ImageDownloader {
  /**
   * markdownに記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param staticDir
   * @param imgDir
   */
  public static async getMarkdownImages(
    markdown: string,
    staticDir: string,
    imgDir: string
  ): Promise<string> {
    const regex =
      /(\!\[.*\]\()(https:\/\/qiita-image-store.*.com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))(\))/g;
    return await this.convertImageLink(regex, markdown, staticDir, imgDir);
  }

  /**
   * <img>タグで記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param staticDir
   * @param imgDir
   */
  public static async getHTMLImages(
    markdown: string,
    staticDir: string,
    imgDir: string
  ): Promise<string> {
    const regex =
      /(<img\s*src=\s*")(https:\/\/qiita-image-store.*com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))("[^<]*>)/g;
    return await this.convertImageLink(regex, markdown, staticDir, imgDir);
  }

  /**
   * 画像ファイルをダウンロードし、画像リンクを書き換える
   * @param regex
   * @param markdown
   * @param staticDir
   * @param imgDir
   */
  static convertImageLink(
    regex: RegExp,
    markdown,
    staticDir: string,
    imgDir: string
  ): Promise<string> {
    const founds = markdown.matchAll(regex);

    for (const found of founds) {
      const url = found[2];
      const fileName = found[3];
      ImageDownloader.downloadImage(url, staticDir, imgDir, fileName);
    }

    markdown = markdown.replace(
      regex,
      (match, p1, p2, p3, p4, p5, offset, string) => {
        return `${p1}/${imgDir}/${p3}${p5}`;
      }
    );

    return markdown;
  }

  /**
   * 画像をダウンロードし、保存する
   * @param url
   * @param staticDir
   * @param imgDir
   * @param fileName
   */
  static async downloadImage(
    url: string,
    staticDir: string,
    imgDir: string,
    fileName: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          const filePath = path.resolve(staticDir, imgDir, fileName);
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          response
            .pipe(fs.createWriteStream(filePath))
            .on("error", reject)
            .once("close", () => {
              resolve();
            });
        } else {
          response.resume();
          reject(
            new Error(`Image Download Failed With : ${response.statusCode}`)
          );
        }
      });
    });
  }
}
