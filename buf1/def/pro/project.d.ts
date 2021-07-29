import { AnyObject, PackageInfo, ModuleAlias } from 'types';
/**
 * 项目配置信息
 */
export interface ProjectConfig<TType extends string> {
    /**
     * 项目类型
     */
    type?: TType;
    /**
     * 项目名称（中文、英文都可以）
     * 不写，则使用package.json中的name字段代替
     */
    name?: string;
    /**
     * 模块的alias
     * webpack.resolve.alias | babel-plugin-module-resolver.alias
     * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
     * <https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md>
     */
    alias?: ModuleAlias;
}
/**
 * 项目实例化参数
 */
export interface ProjectProps<TType extends string, TConfig extends ProjectConfig<TType>> {
    /**
     * 项目目录路径
     */
    root: string;
    /**
     * 项目配置信息
     */
    config?: TConfig | string;
    /**
     * 项目包信息
     */
    package?: PackageInfo;
}
/**
 * 项目元信息（即项目的主要信息）
 */
interface ProjectMeta {
    /**
     * 项目类型
     */
    type: string;
    /**
     * 项目目录路径
     */
    root: string;
    /**
     * 项目配置信息
     */
    config: AnyObject;
    /**
     * 项目包名
     */
    package: PackageInfo;
}
/**
 * 读取项目元信息
 */
export declare function readProjectMeta(projectPath: string): ProjectMeta;
/**
 * 项目
 */
export default abstract class Project<TType extends string, TConfig extends ProjectConfig<TType>> {
    /**
     * 项目ID（依据项目信息自动生成）
     * 规则：${project.type}_${package.json/name}_${project.version}
     */
    readonly id: string;
    /**
     * 项目类型
     */
    readonly type: TType;
    /**
     * 项目目录路径
     */
    readonly root: string;
    /**
     * 项目构建时的临时缓存文件目录
     */
    readonly buf: string;
    /**
     * 项目源文件目录
     */
    readonly src: string;
    /**
     * 项目生成资源文件目录
     */
    readonly pub: string;
    /**
     * 项目文档目录
     */
    readonly doc: string;
    /**
     * 项目模块文件目录
     */
    readonly mdl: string;
    /**
     * typescript配置文件路径
     */
    readonly tsc: string;
    /**
     * 项目生成的资源文件目录
     */
    readonly dist: string;
    /**
     * 项目生成的公共资源文件目录
     */
    readonly astDist: string;
    /**
     * 项目生成的定义文件目录
     */
    readonly defDist: string;
    /**
     * 项目生成的web端资源文件目录
     */
    readonly webDist: string;
    /**
     * 项目生成的node端资源文件目录
     */
    readonly nodeDist: string;
    /**
     * 项目配置信息
     */
    protected config: TConfig;
    /**
     * 项目包信息
     */
    readonly package: PackageInfo;
    /**
     * 项目版本
     */
    readonly version: string;
    /**
     * 项目作者
     */
    readonly author: string;
    /**
     * 项目名称（中文、英文都可以）
     * 不写，则使用package.json中的name字段代替
     */
    readonly name: string;
    /**
     * 模块的alias
     * webpack.resolve.alias | babel-plugin-module-resolver.alias
     * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
     * <https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md>
     */
    readonly alias?: ModuleAlias;
    /**
     * ts配置的缓存
     */
    private __tsConfig__?;
    constructor(type: TType, props: ProjectProps<TType, TConfig>);
    /**
     * 拼接项目根路径
     */
    withRoot(...pathList: string[]): string;
    /**
     * 拼接buf路径
     */
    withBuf(...pathList: string[]): string;
    /**
     * 拼接src路径
     */
    withSrc(...pathList: string[]): string;
    /**
     * 拼接pub路径
     */
    withPub(...pathList: string[]): string;
    /**
     * 拼接doc路径
     */
    withDoc(...pathList: string[]): string;
    /**
     * 拼接dist路径
     */
    withDist(...pathList: string[]): string;
    /**
     * 拼接module路径
     */
    withMdl(...pathList: string[]): string;
    /**
     * 获取项目依赖包的版本
     * 获取不到，则返回空字符串
     */
    getDepVersion(dep: string): string;
    /**
     * 获取项目的ts配置
     */
    getTsconfig(): AnyObject<any>;
    /**
     * 获取项目中的不规范文件名
     * root 需要扫描的文件夹
     * prefix 最后返回的文件路径中，前面补上的公共路径
     */
    getIrregularFileList(root: string, prefix?: string): Promise<string[]>;
}
export {};
