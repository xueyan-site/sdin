/**
 * 导出path原生的函数，于此处做兼容
 */
export declare const basename: (p: string, ext?: string | undefined) => string;
/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export declare const withPath: (...pathSegments: string[]) => string;
/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export declare const joinPath: (...paths: string[]) => string;
/**
 * 当前工作目录（current working directory）
 */
export declare const CWD: string;
/**
 * 基于当前工作目录的相对路径
 * @param {String[]} pathList 路径
 */
export declare const cwdPath: (...pathList: string[]) => string;
/**
 * 基于当前工作目录的node_modules的相对路径
 * @param {String[]} pathList 路径
 */
export declare const cwdNmPath: (...pathList: string[]) => string;
/**
 * 当前模块目录（current module directory）
 */
export declare const CMD: string;
/**
 * 基于当前模块目录的相对路径
 * @param {String[]} pathList 路径
 */
export declare const cmdPath: (...pathList: string[]) => string;
/**
 * 基于当前模块目录的node_modules的相对路径
 * @param {String[]} pathList 路径
 */
export declare const cmdNmPath: (...pathList: string[]) => string;
/**
 * 当前用户的根目录（current home directory）
 */
export declare const CHD: string;
/**
 * 基于当前用户根目录的相对路径
 * @param {String[]} pathList 路径
 */
export declare const chdPath: (...pathList: string[]) => string;
/**
 * 计算path2中引入path1的相对路径
 * @example
 * relativePath('/a/b/c/d/e.js', '/a/b/f/g.js')
 * // result === '../c/d/e.js'
 */
export declare const relativePath: (path1: string, path2: string) => string;
/**
 * 查询路径下对应的文件是否存在，存在则返回
 * resolvePathExtends('/path/to', 'index', ['.tsx', '.ts', '.jsx', '.js'])
 */
export declare function resolvePathExtends(path: string, name: string, exts: string[]): string;
