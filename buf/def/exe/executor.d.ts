/// <reference types="node" />
import EventEmitter from 'events';
import Project, { ProjectConfig } from 'pro/project';
/**
 * 项目执行器实例化参数
 */
export interface ExecutorProps<TProject extends Project<string, ProjectConfig<string>>> {
    project: TProject;
}
/**
 * 项目执行器
 */
export default abstract class Executor<TProject extends Project<string, ProjectConfig<string>>> extends EventEmitter {
    /**
     * 项目对象
     */
    readonly project: TProject;
    /**
     * 是否正在执行
     */
    protected executing: boolean;
    constructor(props: ExecutorProps<TProject>);
    /**
     * 执行器的主要任务
     */
    abstract main(): Promise<void>;
    /**
     * 专用于执行任务的方法，它可以让任务成为可关闭状态
     */
    protected race<TData>(task: Promise<TData>): Promise<TData | undefined>;
    /**
     * 开始运行
     */
    open(): Promise<void>;
    /**
     * 终止运行
     */
    close(): void;
    /**
     * 下载 node_modules
     */
    protected downloadModules(path?: string, name?: string): void;
}
