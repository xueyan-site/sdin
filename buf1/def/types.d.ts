/**
 * 指代任一对象
 */
export interface AnyObject<TValue = any> {
    [prop: string]: TValue;
}
/**
 * git全局配置信息
 */
export interface GitInfo {
    [prop: string]: any;
    user: {
        name: string;
        email: string;
    };
}
/**
 * npm包信息
 */
export interface PackageInfo {
    [prop: string]: any;
    name: string;
    version: string;
    author: string;
}
/**
 * 模块别名
 */
export interface ModuleAlias {
    [index: string]: string;
}
