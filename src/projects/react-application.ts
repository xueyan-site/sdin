import { ProxyConfigArrayItem } from 'webpack-dev-server'
import { Configuration, RuleSetCondition } from 'webpack'
import Project, { ProjectProps, ProjectConfig } from 'projects/project'
import { withPath } from 'utils/path'

/**
 * react应用类型
 */
export type ReactApplicationType = 'react-application'

export const REACT_APPLICATION_TYPE: ReactApplicationType = 'react-application'

/**
 * react应用配置信息
 */
export interface ReactApplicationConfig extends ProjectConfig<ReactApplicationType> {
  /**
   * 开发时启动的端口
   * <http://expressjs.com/en/4x/api.html#app.listen>
   */
  startPort: number

  /**
   * 运行时启动的端口
   * <http://expressjs.com/en/4x/api.html#app.listen>
   */
  servePort: number

  /**
   * 开发时资源的公共路径
   * <https://webpack.docschina.org/configuration/output/#outputpublicpath> 
   */
  startPublicPath: string

  /** 
   * 构建时资源的公共路径
   * <https://webpack.docschina.org/configuration/output/#outputpublicpath> 
   */
  buildPublicPath: string

  /**
   * 开发时的代理设置
   * <https://webpack.docschina.org/configuration/dev-server/#devserverproxy>
   */
  startProxies?: ProxyConfigArrayItem[]

  /**
   * 运行时的代理设置
   * <https://webpack.docschina.org/configuration/dev-server/#devserverproxy>
   */
  serveProxies?: ProxyConfigArrayItem[]

  /**
   * 模块的扩展
   * webpack.externals
   * <https://webpack.docschina.org/configuration/externals/>
   */
  moduleExternals?: Configuration['externals']

  /**
   * 模块的扩展
   * webpack.externals
   * <https://webpack.docschina.org/configuration/externals/>
   */
  babelParseIncludes?: RuleSetCondition[]

  /**
   * 模块的扩展
   * webpack.externals
   * <https://webpack.docschina.org/configuration/externals/>
   */
  babelParseExcludes?: RuleSetCondition[]
}

/**
 * react应用配置信息默认值
 */
export const REACT_APPLICATION_CONFIG: ReactApplicationConfig = {
  type: REACT_APPLICATION_TYPE,
  startPort: 8080,
  servePort: 443,
  startPublicPath: '/',
  buildPublicPath: '/'
}

/**
 * react应用实例化参数
 */
export interface ReactApplicationProps extends ProjectProps<
  ReactApplicationType, 
  ReactApplicationConfig
> {}

/**
 * react应用
 */
export default class ReactApplication extends Project<
  ReactApplicationType, 
  ReactApplicationConfig
> {
  /**
   * 项目生成资源文件目录
   */
  readonly publicPath: string

  constructor(props: ReactApplicationProps) {
    super(props, REACT_APPLICATION_CONFIG)
    this.publicPath = this.withPath('public')
  }

  /**
   * 拼接路径
   */
  withPublicPath(...pathList: string[]) {
    return withPath(this.publicPath, ...pathList)
  }
}
