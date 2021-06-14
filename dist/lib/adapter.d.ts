import { Context } from '@azure/functions';
declare class AzureStaticFileAdapterStatic {
    private files;
    handle(context: Context, staticRoot: string, fallbackPath?: string): void;
}
export declare const AzureStaticFileAdapter: AzureStaticFileAdapterStatic;
export {};
