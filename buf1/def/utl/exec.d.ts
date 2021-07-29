/// <reference types="node" />
/**
 * 同步执行命令，并将信息显示在父进程中
 * @param {String} command 命令
 */
export declare function executeSync(command: string): Buffer;
/**
 * 流或者空
 */
export declare type StreamOrNull = NodeJS.ReadWriteStream | null | undefined | false | '';
/**
 * 流转换函数
 */
export declare type StreamTransfer = (prev: any) => NodeJS.ReadWriteStream | StreamOrNull;
/**
 * 原始流素材
 */
export declare type StreamSource = StreamTransfer | StreamOrNull;
/**
 * 对多个stream进行pipe链接，并加入错误处理
 * @param values
 * @param cb
 * @returns
 */
export declare function pipeline(...sources: StreamSource[]): Promise<void>;
