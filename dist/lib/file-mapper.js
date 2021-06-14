"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileMap = void 0;
const perf_hooks_1 = require("perf_hooks");
const file_handler_1 = require("./file-handler");
class FileMapStatic {
    constructor(filesWihKey) {
        this.files = {};
        filesWihKey.forEach((f) => (this.files[f.key] = f.file));
    }
    keys() {
        return Object.keys(this.files);
    }
    fileExists(key) {
        return this.keys().includes(key);
    }
    async getFile(key) {
        if (this.fileExists(key)) {
            const file = this.files[key];
            return {
                path: file.path,
                body: await file.body,
                length: await file.length,
                contentType: file.contentType,
            };
        }
        else {
            throw new Error(`${key} does not exist.`);
        }
    }
}
async function createFileMap(staticRoot, logger) {
    const startAt = perf_hooks_1.performance.now();
    const filelist = await file_handler_1.createFileList(staticRoot);
    const filesWihKeyNested = filelist.map(file_handler_1.createFileWithKey(staticRoot));
    const filesWihKey = Array().concat(...filesWihKeyNested);
    const files = new FileMapStatic(filesWihKey);
    const elapsedTime = Math.round((perf_hooks_1.performance.now() - startAt) * 1000) / 1000;
    logger.info(`StaticFileServer Init: ${elapsedTime}msec`);
    return files;
}
exports.createFileMap = createFileMap;
