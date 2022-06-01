import { trim } from 'lodash'
import { joinPosixPath } from 'utl/path'
import { Project } from './project'
import type { ProjectProps, ProjectConfig } from './project'

export interface ApplicationConfig<T extends string> extends ProjectConfig<T> {
  /**
   * 项目url中的公共路径
   * <https://webpack.docschina.org/configuration/output/#outputpublicpath> 
   */
  path?: string
}

export interface ApplicationProps<
  T extends string,
  C extends ApplicationConfig<T>,
> extends ProjectProps<T,C> {}

export abstract class Application<
  T extends string,
  C extends ApplicationConfig<T>,
> extends Project<T,C> {
  
  /** url中的公共路径（以'/'开头和结尾）*/
  readonly publicPath: string

  /** 项目的素材路径（以'/'开头和结尾）*/
  readonly assetsPath: string

  constructor(type: T, props: ApplicationProps<T,C>) {
    super(type, props)
    const __path__ = trim(this.config.path || '', '/ ')
    this.publicPath = __path__ ? `/${__path__}/` : '/'
    this.assetsPath = this.joinPath('ast/')
  }

  /**
   * 以本项目公共path为前缀，拼接其它path
   */
  joinPath(...pathList: string[]) {
    return joinPosixPath(this.publicPath, ...pathList)
  }
}
