import Application, { ApplicationConfig } from './application';
/**
 * 节点属性键值对
 */
export interface NodeAttrs {
    key: string;
    children: string | undefined;
    [prop: string]: string | boolean | undefined;
}
/**
 * 页面配置
 */
export interface PageConfig {
    /**
     * 页面名称
     */
    name?: string;
    /**
     * 页面url后缀
     */
    path?: string;
    /**
     * 入口文件
     */
    entry?: string;
    /**
     * 容器，默认是没有的
     * 若有，则会将entry作为children传入
     * 它会接收与entry相同的参数
     */
    container?: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 插入模版的meta标签
     */
    metas?: NodeAttrs[];
    /**
     * 插入模版的样式列表
     */
    links?: NodeAttrs[];
    /**
     * 插入模版的脚本列表
     */
    scripts?: NodeAttrs[];
    /**
     * 插入模版的样式列表
     */
    styles?: NodeAttrs[];
}
/**
 * 页面实例化参数
 */
export interface PageProps<TProject extends Application<string, ApplicationConfig<string>>> {
    /**
     * 文件夹名称
     */
    folder: string;
    /**
     * 页面所属项目
     */
    project: TProject;
}
/**
 * 页面
 */
export default abstract class Page<TProject extends Application<string, ApplicationConfig<string>>, TConfig extends PageConfig> {
    /**
     * 页面ID
     */
    readonly id: string;
    /**
     * 页面url后缀（默认使用文件夹名）
     */
    readonly path: string;
    /**
     * 页面url路径（全路径）
     */
    readonly fullPath: string;
    /**
     * 名称（默认使用path）
     */
    readonly name: string;
    /**
     * 页面目录路径
     */
    readonly root: string;
    /**
     * 页面所属项目
     */
    readonly project: TProject;
    /**
     * 页面配置文件内容
     */
    protected config: TConfig;
    /**
     * 入口文件（默认使用index.tsx）
     */
    readonly entry: string;
    /**
     * 容器，默认是没有的
     * 若有，则会将entry作为children传入
     * 它会接收与entry相同的参数
     */
    readonly container?: string;
    /**
     * 标题
     */
    readonly title: string;
    /**
     * 插入模版的meta标签
     */
    readonly metas: NodeAttrs[];
    /**
     * 插入模版的样式列表
     */
    readonly links: NodeAttrs[];
    /**
     * 插入模版的脚本列表
     */
    readonly scripts: NodeAttrs[];
    /**
     * 插入模版的样式列表
     */
    readonly styles: NodeAttrs[];
    constructor(props: PageProps<TProject>, __config__: TConfig);
    /**
     * 拼接页面根路径
     */
    withRoot(...pathList: string[]): string;
    /**
     * 唯一性对比（id）
     */
    protected compareWithId(a: NodeAttrs, b: NodeAttrs): boolean;
    /**
     * 确保节点唯一
     * @param name
     */
    protected uniqNodeAttrs(a: NodeAttrs[] | undefined, b: NodeAttrs[] | undefined): NodeAttrs[];
    /**
     * 将节点们转换成标签
     */
    nodesToHTML(label: string, nodes: NodeAttrs[]): string;
}
