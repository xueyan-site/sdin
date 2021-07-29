/**
 * 打印错误信息
 * @param {String} msg 信息
 */
export declare const printError: (msg: string | Error, callback?: (() => void) | undefined) => void;
/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export declare const printExitError: (msg: string | Error, code?: number | undefined) => void;
/**
 * 打印普通信息
 * @param {String} msg 信息
 */
export declare const printInfo: (msg: string, callback?: (() => void) | undefined) => void;
/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export declare const printExitInfo: (msg: string, code?: number | undefined) => void;
/**
 * 打印加载信息
 * @param {String} msg 信息
 */
export declare const printLoading: (msg: string) => void;
/**
 * 打印警告信息
 * @param {String} msg 信息
 */
export declare const printWarning: (msg: string) => void;
/**
 * 打印成功信息
 * @param {String} msg 信息
 */
export declare const printSuccess: (msg: string) => void;
