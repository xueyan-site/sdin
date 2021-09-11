import { trim } from 'lodash'
import { joinPosixPath } from 'utl/path'
import Project from './project'
import type { ProjectProps, ProjectConfig } from './project'

/**
 * 应用配置信息
 */
export interface ApplicationConfig<TType extends string> extends ProjectConfig<TType> {
  /**
   * 项目url中的公共路径
   * <https://webpack.docschina.org/configuration/output/#outputpublicpath> 
   */
  path?: string
}

/**
 * 应用实例化参数
 */
export interface ApplicationProps<
  TType extends string,
  TConfig extends ApplicationConfig<TType>
> extends ProjectProps<TType, TConfig> {}

/**
 * application应用
 */
export default abstract class Application<
  TType extends string,
  TConfig extends ApplicationConfig<TType>
> extends Project<TType, TConfig> {
  /**
   * url中的公共路径（始终以'/'开头和结尾）
   */
  readonly publicPath: string

  constructor(type: TType, props: ApplicationProps<TType, TConfig>) {
    super(type, props)
    let __path__: string = this.config.path || ''
    if (__path__[0]) {
      __path__ = trim(__path__, '/ ')
    }
    this.publicPath = __path__ ? `/${__path__}/` : '/'
  }

  /**
   * 以本项目公共path为前缀，拼接其它path
   * @param pathList 
   * @returns 
   */
  joinPath(...pathList: string[]) {
    return joinPosixPath(this.publicPath, ...pathList)
  }
}
