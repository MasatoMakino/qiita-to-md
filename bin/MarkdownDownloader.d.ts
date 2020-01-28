import { Options } from "./Options";
export declare class MarkdownDownloader {
    static download(options: Options): Promise<void>;
    /**
     * 記事リストを取得する。
     * @param itemsCount
     * @param options
     */
    static getItems(itemsCount: number, options: Options): Promise<void>;
    /**
     * 記事保存用のディレクトリを作成する。
     */
    static makeDir(options: Options): void;
    /**
     * 記事本文を整形する。
     * Qiitaサーバーに保存された画像はローカルに取得、リンクを書き換える。
     * @param item
     */
    static makeBody(item: any, options: Options): Promise<string>;
    static reformatItem(item: any, options: Options): Promise<void>;
    /**
     * タグの名称のみを配列化する。
     * @param tags
     */
    static getTagArray(tags: any): any;
}
//# sourceMappingURL=MarkdownDownloader.d.ts.map