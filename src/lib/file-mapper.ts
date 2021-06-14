import { performance } from 'perf_hooks';
import { Logger } from '@azure/functions';
import {
  createFileList,
  createFileWithKey,
  FileAsync,
  FileWithKey,
} from './file-handler';

export interface File {
  readonly path: string;
  readonly body: Buffer;
  readonly length: number;
  readonly contentType: string;
}

export interface FileMap {
  keys: (arg: void) => string[];
  fileExists: (key: string) => boolean;
  getFile: (key: string) => Promise<File>;
}

class FileMapStatic implements FileMap {
  private files: Record<string, FileAsync> = {};

  constructor(filesWihKey: FileWithKey[]) {
    filesWihKey.forEach((f) => (this.files[f.key] = f.file));
  }

  keys(): string[] {
    return Object.keys(this.files);
  }

  fileExists(key: string): boolean {
    return this.keys().includes(key);
  }

  async getFile(key: string): Promise<File> {
    if (this.fileExists(key)) {
      const file = this.files[key];
      return {
        path: file.path,
        body: await file.body,
        length: await file.length,
        contentType: file.contentType,
      };
    } else {
      throw new Error(`${key} does not exist.`);
    }
  }
}

export async function createFileMap(
  staticRoot: string,
  logger: Logger,
): Promise<FileMap> {
  const startAt = performance.now();

  const filelist = await createFileList(staticRoot);
  const filesWihKeyNested = filelist.map(createFileWithKey(staticRoot));
  const filesWihKey = Array<FileWithKey>().concat(...filesWihKeyNested);
  const files = new FileMapStatic(filesWihKey);

  const elapsedTime = Math.round((performance.now() - startAt) * 1000) / 1000;
  logger.info(`StaticFileServer Init: ${elapsedTime}msec`);
  return files;
}
