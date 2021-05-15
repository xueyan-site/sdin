import Project, { ProjectConfig } from 'projects/project'
import Executor, { ExecutorProps } from './executor'

/**
 * 项目构建器实例化参数
 */
export interface BuilderProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目构建器
 */
export default abstract class Builder<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: BuilderProps<TProject>) {
    super(props)
  }
}
