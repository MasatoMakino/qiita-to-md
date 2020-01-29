"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class Options {}
exports.Options = Options;
class OptionsUtil {
  static init(options) {
    var _a, _b, _c, _d, _e, _f;
    options = options !== null && options !== void 0 ? options : {};
    options.contentsDir =
      ((_a = options.contentsDir),
      _a !== null && _a !== void 0 ? _a : "./contents");
    options.jsonDir =
      ((_b = options.jsonDir), _b !== null && _b !== void 0 ? _b : "json");
    options.mdDir =
      ((_c = options.mdDir), _c !== null && _c !== void 0 ? _c : "md");
    options.staticDir =
      ((_d = options.staticDir),
      _d !== null && _d !== void 0 ? _d : "./static/");
    options.imgDir =
      ((_e = options.imgDir), _e !== null && _e !== void 0 ? _e : "img/post");
    options.token =
      ((_f = options.token),
      _f !== null && _f !== void 0 ? _f : path.resolve(".qiita_token.json"));
    return options;
  }
}
exports.OptionsUtil = OptionsUtil;
