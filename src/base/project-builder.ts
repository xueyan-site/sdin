import Project, { ProjectConfig } from './project'
import Executor, { ExecutorProps } from './executor'

/**
 * 项目构建器实例化参数
 */
export interface ProjectBuilderProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目构建器
 */
export default abstract class ProjectBuilder<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: ProjectBuilderProps<TProject>) {
    super(props)
  }
}
