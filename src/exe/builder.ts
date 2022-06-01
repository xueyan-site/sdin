import { Executor } from './executor'
import type { Project } from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

export interface BuilderProps<
  P extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<P> {}

export abstract class Builder<
  P extends Project<string, ProjectConfig<string>>
> extends Executor<P> {
  constructor(props: BuilderProps<P>) {
    super(props)
  }
}
