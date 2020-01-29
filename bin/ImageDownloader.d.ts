export declare class ImageDownloader {
  /**
   * markdownに記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param imgDir
   */
  static getMarkdownImages(
    markdown: string,
    staticDir: string,
    imgDir: string
  ): Promise<string>;
  /**
   * <img>タグで記載されたQiitaサーバー内の画像をダウンロードし、参照URLを書き換える。
   * @param markdown
   * @param imgDir
   */
  static getHTMLImages(
    markdown: string,
    staticDir: string,
    imgDir: string
  ): Promise<string>;
  /**
   * 画像ファイルをダウンロードし、画像リンクを書き換える
   * @param regex
   * @param markdown
   * @param staticDir
   * @param imgDir
   */
  static convertImageLink(
    regex: RegExp,
    markdown: any,
    staticDir: string,
    imgDir: string
  ): Promise<string>;
  /**
   * 画像をダウンロードし、保存する
   * @param url
   * @param staticDir
   * @param imgDir
   * @param fileName
   */
  static downloadImage(
    url: string,
    staticDir: string,
    imgDir: string,
    fileName: string
  ): Promise<null>;
}
//# sourceMappingURL=ImageDownloader.d.ts.map
