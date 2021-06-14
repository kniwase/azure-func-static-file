import { performance } from 'perf_hooks';
import { Context } from '@azure/functions';
import { FileMap } from './file-mapper';

interface Header {
  'Content-Type': string;
  'Content-Length': number;
}

interface Response {
  body: Buffer;
  headers: Header;
  status: number;
}

function convPathoKey(path: string): string {
  let key: string = path;
  if (path.endsWith('/')) {
    key = key.slice(0, -1);
  }
  if (!key.startsWith('/')) {
    key = '/' + key;
  }
  return key;
}

function createHeader(contentType: string, length: number): Header {
  return {
    'Content-Type': contentType,
    'Content-Length': length,
  };
}

async function createResponse(
  files: FileMap,
  reqestedKey: string,
  fallbackKey: string | undefined,
): Promise<Response> {
  if (files.fileExists(reqestedKey)) {
    const { body, contentType, length } = await files.getFile(reqestedKey);
    const headers = createHeader(contentType, length);
    return { body, headers, status: 200 };
  } else if (fallbackKey && files.fileExists(fallbackKey)) {
    const { body, contentType, length } = await files.getFile(fallbackKey);
    const headers = createHeader(contentType, length);
    return { body, headers, status: 404 };
  } else {
    const body = Buffer.from('Not Found');
    const headers = createHeader('text/plain; charset="UTF-8"', body.length);
    return { body, headers, status: 404 };
  }
}

export async function reply(
  files: Promise<FileMap>,
  context: Context,
  fallbackPath?: string,
) {
  const startAt = performance.now();

  const pathParam = context.bindingData.segments;
  const reqestedKey = convPathoKey(pathParam || '/index.html');
  const fallbackKey = fallbackPath ? convPathoKey(fallbackPath) : undefined;
  context.res = await createResponse(await files, reqestedKey, fallbackKey);

  const statusCode = context.res.status.toString();
  const elapsedTime = Math.round((performance.now() - startAt) * 1000) / 1000;
  context.log.info(
    ['GET', reqestedKey, statusCode, `${elapsedTime}msec`].join(' '),
  );

  context.done();
}
