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
  public static getMarkdownImages(markdown, staticRoot, imgDir): string {
    const regex = /(\!\[.*\]\()(https:\/\/qiita-image-store.*.com\/.*\/([a-z0-9\-]+\.(gif|jpe?g|png)))(\))/g;
    const founds: string[] = markdown.matchAll(regex);

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
   * <img>タグで記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param imgDir
   * @return {void | string}
   */
  public static getHTMLImages(markdown, staticRoot, imgDir) {
    const regex = /(<img\s*src=\s*")(https:\/\/qiita-image-store.*com\/.*\/)([a-z0-9\-]+\.(gif|jpe?g|png))("[^<]*>)/g;
    const founds = markdown.matchAll(regex);

    for (const found of founds) {
      const url = found[2] + found[3];
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
   * @param imgDir
   * @param fileName
   */
  static downloadImage(url, staticRoot, imgDir, fileName) {
    request({ method: "GET", url: url, encoding: null }, function(
      error,
      response,
      imgBody
    ) {
      if (!error && response.statusCode === 200) {
        fs.writeFile(
          path.resolve(staticRoot, imgDir, fileName),
          imgBody,
          "binary",
          err => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });
  }
}
