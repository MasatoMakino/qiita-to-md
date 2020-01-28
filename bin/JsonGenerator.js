"use strict";
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
const path = require("path");
const processmd = require("processmd").default;
const defaultOptions = require("processmd/defaultOptions.js");
const MarkdownDownloader_1 = require("./MarkdownDownloader");
const Options_1 = require("./Options");
class JsonGenerator {
    static generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Options_1.OptionsUtil.init(options);
            yield MarkdownDownloader_1.MarkdownDownloader.download(options);
            const processMDOptions = this.initProcessMDOptions(options);
            processmd(processMDOptions, (err, data) => {
                if (err) {
                    process.stderr.write(JSON.stringify(err));
                }
                if (processMDOptions.stdout) {
                    process.stdout.write(JSON.stringify(data, null, 2));
                }
            });
        });
    }
    static initProcessMDOptions(options) {
        const processMDOptions = Object.assign({}, defaultOptions);
        processMDOptions.files = path.resolve(options.contentsDir, options.mdDir, "**/*.md");
        processMDOptions.outputDir = path.resolve(options.contentsDir, options.jsonDir);
        processMDOptions.preview = 600;
        processMDOptions.previewDelimiter = '。';
        processMDOptions.markdownOptions.html = true;
        processMDOptions.summaryOutput = path.resolve(processMDOptions.outputDir, "summary.json");
        return processMDOptions;
    }
}
exports.JsonGenerator = JsonGenerator;
