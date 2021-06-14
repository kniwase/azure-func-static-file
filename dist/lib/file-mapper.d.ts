/// <reference types="node" />
import { Logger } from '@azure/functions';
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
export declare function createFileMap(staticRoot: string, logger: Logger): Promise<FileMap>;
