import { joinPath } from 'utl/path'
import Project, { ProjectProps, ProjectConfig } from './project'

/**
 * 应用配置信息
 */
export interface ApplicationConfig<TType extends string> extends ProjectConfig<TType> {
  /**
   * 项目url中的公共路径
   * <https://webpack.docschina.org/configuration/output/#outputpublicpath> 
   */
  path: string

  /**
   * 项目的根页面
   * 若不写，则没有项目的根页面
   */
  index?: string
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
   * 项目url中的公共路径
   */
  readonly path: string

  /**
   * 项目的根页面（填写的应当是页面的path）
   */
  readonly index?: string

  constructor(props: ApplicationProps<TType, TConfig>, defaultConfig: TConfig) {
    super(props, defaultConfig)
    const config = this.config
    const __config__ = this.__config__
    this.path = config.path = __config__.path || '/'
    this.index = config.index
  }

  joinPath(...pathList: string[]) {
    return joinPath(this.path, ...pathList)
  }
}
