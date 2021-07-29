import Project, { ProjectProps, ProjectConfig } from './project';
/**
 * 包类型
 */
export declare type PackageType = 'package';
export declare const PACKAGE_TYPE: PackageType;
/**
 * 包配置信息
 */
export interface PackageConfig extends ProjectConfig<PackageType> {
    /**
     * 构建出web端使用的脚本
     */
    buildWeb?: boolean;
    /**
     * 构建出node端使用的脚本
     */
    buildNode?: boolean;
    /**
     * 构建出定义文件
     */
    buildTypes?: boolean;
    /**
     * 构建出完全独立的单文件Web版本（会包含node_modules中引入的包）
     */
    /**
     * 构建出完全独立的单文件Node版本（会包含node_modules中引入的包）
     */
    /**
     * 使用react
     */
    useReact?: boolean;
    /**
     * 混淆代码
     */
    useUglify?: boolean;
}
/**
 * 包实例化参数
 */
export interface PackageProps extends ProjectProps<PackageType, PackageConfig> {
}
/**
 * 包
 */
export default class Package extends Project<PackageType, PackageConfig> {
    /**
     * 构建出web端使用的脚本
     */
    readonly buildWeb: boolean;
    /**
     * 构建出node端使用的脚本
     */
    readonly buildNode: boolean;
    /**
     * 构建出定义文件
     */
    readonly buildTypes: boolean;
    /**
     * 使用react
     */
    readonly useReact: boolean;
    /**
     * 混淆代码
     */
    readonly useUglify: boolean;
    constructor(props: PackageProps);
}
