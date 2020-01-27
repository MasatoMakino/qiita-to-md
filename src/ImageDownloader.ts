const fs = require("fs");
const path = require("path");
const request = require("request");

export class ImageDownloader {
  /**
   * markdownに記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param imgDir
   * @return {*}
   */
  public static async getMarkdownImages(
    markdown,
    staticRoot,
    imgDir
  ): Promise<string> {
    const regex = /(\!\[.*\]\()(https:\/\/qiita-image-store.*.com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))(\))/g;
    return await this.convertImageLink(regex, markdown, staticRoot, imgDir);
  }

  /**
   * <img>タグで記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param imgDir
   * @return {void | string}
   */
  public static async getHTMLImages(
    markdown,
    staticRoot,
    imgDir
  ): Promise<string> {
    const regex = /(<img\s*src=\s*")(https:\/\/qiita-image-store.*com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))("[^<]*>)/g;
    return await this.convertImageLink(regex, markdown, staticRoot, imgDir);
  }

  /**
   * 画像ファイルをダウンロードし、画像リンクを書き換える
   * @param regex
   * @param markdown
   * @param staticRoot
   * @param imgDir
   */
  static convertImageLink(
    regex: RegExp,
    markdown,
    staticRoot: string,
    imgDir: string
  ): Promise<string> {
    const founds = markdown.matchAll(regex);

    for (const found of founds) {
      const url = found[2];
      const fileName = found[3];
      ImageDownloader.downloadImage(url, staticRoot, imgDir, fileName);
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
   * @param staticRoot
   * @param imgDir
   * @param fileName
   */
  static async downloadImage(
    url: string,
    staticRoot: string,
    imgDir: string,
    fileName: string
  ): Promise<null> {
    return new Promise((resolve, reject) => {
      request({ method: "GET", url: url, encoding: null }, function(
        error,
        response,
        imgBody
      ) {
        if (error || response.statusCode !== 200) {
          return reject();
        }

        fs.writeFile(
          path.resolve(staticRoot, imgDir, fileName),
          imgBody,
          "binary",
          err => {
            if (err) {
              console.log(err);
            }
            return resolve();
          }
        );
      });
    });
  }
}