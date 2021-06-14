import { resolve } from 'path';
import { Context } from '@azure/functions';
import { FileMap, createFileMap } from './file-mapper';
import { reply } from './responsor';

class AzureStaticFileAdapterStatic {
  private files: Promise<FileMap>;

  handle(context: Context, staticRoot: string, fallbackPath = '/index.html') {
    if (!this.files) {
      this.files = createFileMap(resolve(staticRoot), context.log);
    }
    reply(this.files, context, fallbackPath);
  }
}

export const AzureStaticFileAdapter = new AzureStaticFileAdapterStatic();
