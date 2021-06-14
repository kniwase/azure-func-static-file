import { Context } from '@azure/functions';
import { FileMap } from './file-mapper';
export declare function reply(files: Promise<FileMap>, context: Context, fallbackPath?: string): Promise<void>;
