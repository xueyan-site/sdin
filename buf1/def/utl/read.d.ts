/// <reference types="node" />
import { Stats } from 'fs-extra';
import { PackageInfo, GitInfo, AnyObject } from 'types';
/**
 * 深度遍历的节点信息
 */
export interface DeepReadNode {
    name: string;
    stats: Stats;
    source: string;
    offset: string;
    current: string;
}
/**
 * 对深度遍历读取做一层封装
 * 屏蔽current、offset等接口
 * @param param0
 */
export declare function deepRead(source: string, handler: (node: DeepReadNode) => (void | Promise<void>), filter?: (node: DeepReadNode) => (boolean | Promise<boolean>)): Promise<void>;
/**
 * 用于包装数据获取器
 * 近期获取过的数据，可直接从缓存中取出使用，加快程序的运行速度
 *
 * @param getter 数据获取器
 * @param expire 数据的过期时间
 * @returns
 */
export declare function withCache<K, V, P = void>(getter: (key: K, props: P) => V, expire?: number): (key: K, props: P) => V;
/**
 * 获取json信息
 *
 * 关于 value：
 * 若传入的值是string，则与relationPath拼接成路径，读取该路径的文件
 *   json: 使用readJSONSync进行读取
 *   js/mjs: 使用require进行读取
 * 若传入的值是object，则原样返回
 * 若是其他值，则返回undefined
 *
 * @param value 指定传入的值，可以是字符串、对象，或其他值
 * @param root 指定文件的参考目录 @default ''
 * @param strict 是否启用严格模式（一定要有，没有则报错）
 */
export declare function readJsonSync(value: any, root?: string, strict?: boolean): AnyObject;
/**
 * 获取git全局配置信息
 */
export declare function readGitConfigSync(): GitInfo;
/**
 * 根据文件夹目录，获取包的信息
 * @param {String} dirPath 指定文件夹目录
 */
export declare function readPackageInfoSync(projectPath: string): PackageInfo;
