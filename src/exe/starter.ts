import Project, { ProjectConfig } from 'pro/project'
import Executor, { ExecutorProps } from './executor'

/**
 * 项目启动器实例化参数
 */
export interface StarterProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目启动器
 */
export default abstract class Starter<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: StarterProps<TProject>) {
    super(props)
  }
}