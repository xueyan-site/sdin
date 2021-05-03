import Project, { ProjectConfig } from './project'
import Executor, { ExecutorProps } from './executor'

/**
 * 项目构建器实例化参数
 */
export interface ProjectServerProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目构建器
 */
export default abstract class ProjectServer<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: ProjectServerProps<TProject>) {
    super(props)
  }
}
