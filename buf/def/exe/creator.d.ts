import Project, { ProjectConfig } from 'pro/project';
import Executor, { ExecutorProps } from './executor';
/**
 * 项目创建器实例化参数
 */
export interface CreatorProps<TProject extends Project<string, ProjectConfig<string>>> extends ExecutorProps<TProject> {
    /**
     * 实例化项目时，使用的模版名称
     */
    template?: string;
}
/**
 * 项目创建器
 */
export default abstract class Creator<TProject extends Project<string, ProjectConfig<string>>> extends Executor<TProject> {
    protected templatePath: string;
    constructor(props: CreatorProps<TProject>, defaultTemplate: string);
    /**
     * 复制项目代码
     */
    protected generateProject(): Promise<void>;
    /**
     * 初始化git仓库
     */
    protected initializeGitRepository(): void;
}
