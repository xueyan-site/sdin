import { Executor } from './executor'
import type { Project } from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

export interface StarterProps<
  P extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<P> {}

export abstract class Starter<
  P extends Project<string, ProjectConfig<string>>
> extends Executor<P> {
  constructor(props: StarterProps<P>) {
    super(props)
  }
}
