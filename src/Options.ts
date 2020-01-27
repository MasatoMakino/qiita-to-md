const path = require("path");

export class Options {
  contentsDir?: string;
  jsonDir?: string;
  mdDir?: string;
  imgDir?: string;
  token?: string;
}

export class OptionsUtil {
  public static init(options: Options): Options {
    options.contentsDir = options.contentsDir ?? "./contents";
    options.jsonDir = options.jsonDir ?? "json";
    options.mdDir = options.mdDir ?? "md";
    options.imgDir = options.imgDir ?? "./static/img/post";
    options.token = options.token ?? path.resolve(".qiita_token.json");
    return options;
  }
}
