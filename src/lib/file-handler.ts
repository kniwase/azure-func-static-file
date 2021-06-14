import { readdir, stat, readFile } from 'fs/promises';
import { basename, dirname, resolve } from 'path';
import { getType } from 'mime';

export interface FileAsync {
  readonly path: string;
  readonly body: Promise<Buffer>;
  readonly length: Promise<number>;
  readonly contentType: string;
}

export interface FileWithKey {
  key: string;
  file: FileAsync;
}

async function getLength(body: Promise<Buffer>): Promise<number> {
  return (await body).length;
}

function getContentType(path: string): string {
  const type = getType(path);
  if (type) {
    return type;
  } else {
    return 'application/octet-stream';
  }
}

function createFileObj(path: string): FileAsync {
  const body = readFile(path);
  const length = getLength(body);
  const contentType = getContentType(path);
  return { path, body, length, contentType };
}

export async function createFileList(dir: string): Promise<string[]> {
  const dirAbs = resolve(dir);
  const filenames = await readdir(dirAbs);
  const filepaths = filenames.map((path) => resolve(dirAbs, path));
  const filelistNestedPromise = filepaths.map(async (path) => {
    const status = await stat(path);
    if (status && status.isDirectory()) {
      return await createFileList(path);
    } else {
      return [path];
    }
  });
  const filelistNested = await Promise.all(filelistNestedPromise);
  const filelist = ([] as string[]).concat(...filelistNested);
  return filelist;
}

export function createFileWithKey(staticRoot: string) {
  return (path: string): FileWithKey[] => {
    const file = createFileObj(path);
    const key = path.replace(staticRoot, '').replace(/\\/g, '/');
    if (basename(path) === 'README.md') {
      return [];
    } else if (basename(path) === 'index.html') {
      return [
        { key, file },
        { key: dirname(key), file },
      ];
    } else {
      return [{ key, file }];
    }
  };
}
