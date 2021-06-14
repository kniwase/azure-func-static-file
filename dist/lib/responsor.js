"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reply = void 0;
const perf_hooks_1 = require("perf_hooks");
function convPathoKey(path) {
    let key = path;
    if (path.endsWith('/')) {
        key = key.slice(0, -1);
    }
    if (!key.startsWith('/')) {
        key = '/' + key;
    }
    return key;
}
function createHeader(contentType, length) {
    return {
        'Content-Type': contentType,
        'Content-Length': length,
    };
}
async function createResponse(files, reqestedKey, fallbackKey) {
    if (files.fileExists(reqestedKey)) {
        const { body, contentType, length } = await files.getFile(reqestedKey);
        const headers = createHeader(contentType, length);
        return { body, headers, status: 200 };
    }
    else if (fallbackKey && files.fileExists(fallbackKey)) {
        const { body, contentType, length } = await files.getFile(fallbackKey);
        const headers = createHeader(contentType, length);
        return { body, headers, status: 404 };
    }
    else {
        const body = Buffer.from('Not Found');
        const headers = createHeader('text/plain; charset="UTF-8"', body.length);
        return { body, headers, status: 404 };
    }
}
async function reply(files, context, fallbackPath) {
    const startAt = perf_hooks_1.performance.now();
    const pathParam = context.bindingData.segments;
    const reqestedKey = convPathoKey(pathParam || '/index.html');
    const fallbackKey = fallbackPath ? convPathoKey(fallbackPath) : undefined;
    context.res = await createResponse(await files, reqestedKey, fallbackKey);
    const statusCode = context.res.status.toString();
    const elapsedTime = Math.round((perf_hooks_1.performance.now() - startAt) * 1000) / 1000;
    context.log.info(['GET', reqestedKey, statusCode, `${elapsedTime}msec`].join(' '));
    context.done();
}
exports.reply = reply;
