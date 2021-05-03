import { mapValues } from 'lodash'
import Project, { ProjectConfig } from './project'
import Executor, { ExecutorProps } from './executor'
import { cmdNmPath, relativePath } from 'utils/path'

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

  protected getModuleAliasBabelPlugin(): any {
    const aliasMap = mapValues(this.project.config.moduleAlias || {}, value => {
      return this.project.withPath(value)
    })
    const aliasKeys = Object.keys(aliasMap)
    if (aliasKeys.length <= 0) {
      return
    }
    const resolvePath = (source: string, current: string) => {
      let matchedKey: string = ''
      for(let i = 0; i < aliasKeys.length; i++) {
        const key = aliasKeys[i]
        if (key[0] === source[0] && source.startsWith(key)) {
          matchedKey = key
          break
        }
      }
      if (!matchedKey) {
        return source
      }
      return relativePath(
        this.project.withPath(source.replace(matchedKey, aliasMap[matchedKey])),
        current
      )
    }
    return [
      cmdNmPath('babel-plugin-module-resolver'),
      { resolvePath }
    ]
  }
}
