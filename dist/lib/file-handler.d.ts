/// <reference types="node" />
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
export declare function createFileList(dir: string): Promise<string[]>;
export declare function createFileWithKey(staticRoot: string): (path: string) => FileWithKey[];
