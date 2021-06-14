"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileWithKey = exports.createFileList = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const mime_1 = require("mime");
async function getLength(body) {
    return (await body).length;
}
function getContentType(path) {
    const type = mime_1.getType(path);
    if (type) {
        return type;
    }
    else {
        return 'application/octet-stream';
    }
}
function createFileObj(path) {
    const body = promises_1.readFile(path);
    const length = getLength(body);
    const contentType = getContentType(path);
    return { path, body, length, contentType };
}
async function createFileList(dir) {
    const dirAbs = path_1.resolve(dir);
    const filenames = await promises_1.readdir(dirAbs);
    const filepaths = filenames.map((path) => path_1.resolve(dirAbs, path));
    const filelistNestedPromise = filepaths.map(async (path) => {
        const status = await promises_1.stat(path);
        if (status && status.isDirectory()) {
            return await createFileList(path);
        }
        else {
            return [path];
        }
    });
    const filelistNested = await Promise.all(filelistNestedPromise);
    const filelist = [].concat(...filelistNested);
    return filelist;
}
exports.createFileList = createFileList;
function createFileWithKey(staticRoot) {
    return (path) => {
        const file = createFileObj(path);
        const key = path.replace(staticRoot, '').replace(/\\/g, '/');
        if (path_1.basename(path) === 'README.md') {
            return [];
        }
        else if (path_1.basename(path) === 'index.html') {
            return [
                { key, file },
                { key: path_1.dirname(key), file },
            ];
        }
        else {
            return [{ key, file }];
        }
    };
}
exports.createFileWithKey = createFileWithKey;
