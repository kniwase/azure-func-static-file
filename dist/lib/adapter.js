"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStaticFileAdapter = void 0;
const path_1 = require("path");
const file_mapper_1 = require("./file-mapper");
const responsor_1 = require("./responsor");
class AzureStaticFileAdapterStatic {
    handle(context, staticRoot, fallbackPath = '/index.html') {
        if (!this.files) {
            this.files = file_mapper_1.createFileMap(path_1.resolve(staticRoot), context.log);
        }
        responsor_1.reply(this.files, context, fallbackPath);
    }
}
exports.AzureStaticFileAdapter = new AzureStaticFileAdapterStatic();
