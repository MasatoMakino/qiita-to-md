/// <reference types="node" />
import Global = NodeJS.Global;
export interface GlobalWithCognitoFix extends Global {
    fetch: any;
}
export * from "./ImageDownloader";
export * from "./MarkdownDownloader";
export * from "./JsonGenerator";
//# sourceMappingURL=index.d.ts.map