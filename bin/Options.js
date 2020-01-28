"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class Options {
}
exports.Options = Options;
class OptionsUtil {
    static init(options) {
        var _a, _b, _c, _d, _e;
        options = (options !== null && options !== void 0 ? options : {});
        options.contentsDir = (_a = options.contentsDir, (_a !== null && _a !== void 0 ? _a : "./contents"));
        options.jsonDir = (_b = options.jsonDir, (_b !== null && _b !== void 0 ? _b : "json"));
        options.mdDir = (_c = options.mdDir, (_c !== null && _c !== void 0 ? _c : "md"));
        options.imgDir = (_d = options.imgDir, (_d !== null && _d !== void 0 ? _d : "./static/img/post"));
        options.token = (_e = options.token, (_e !== null && _e !== void 0 ? _e : path.resolve(".qiita_token.json")));
        return options;
    }
}
exports.OptionsUtil = OptionsUtil;
