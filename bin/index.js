"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
global.fetch = require('node-fetch').default;
__export(require("./ImageDownloader"));
__export(require("./MarkdownDownloader"));
__export(require("./JsonGenerator"));
