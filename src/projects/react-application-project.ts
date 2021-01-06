import RootProject, { RootProjectProps, RootProjectConfig } from './root-project'
import { ProxyConfigArrayItem } from 'webpack-dev-server'
import { Resolve, ExternalsElement, RuleSetCondition } from 'webpack'

export type ReactApplicationType = 'react-application'

export type ReactApplicationProps = RootProjectProps

/**
 * xueyan.config
 */
export interface ReactApplicationConfig extends RootProjectConfig<ReactApplicationType> {
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  startPort?: number
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  servePort?: number
  /** <https://webpack.docschina.org/configuration/output/#outputpublicpath> */
  startPublicPath?: string
  /** <https://webpack.docschina.org/configuration/output/#outputpublicpath> */
  buildPublicPath?: string
  /** <https://webpack.docschina.org/configuration/dev-server/#devserverproxy> */
  startProxies?: ProxyConfigArrayItem[]
  /** <https://webpack.docschina.org/configuration/dev-server/#devserverproxy> */
  serveProxies?: ProxyConfigArrayItem[]
  /** <https://webpack.docschina.org/configuration/resolve/#resolvealias> */
  moduleAlias?: Resolve['alias']
  /** <https://webpack.docschina.org/configuration/externals/> */
  moduleExternals?: ExternalsElement[]
  /** <https://webpack.docschina.org/configuration/module/#condition> */
  babelParseIncludes?: RuleSetCondition[]
  /** <https://webpack.docschina.org/configuration/module/#condition> */
  babelParseExcludes?: RuleSetCondition[]
}

export default class ReactApplicationProject extends RootProject<ReactApplicationType> {
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
   * 模块的alias
   * webpack.resolve.alias
   * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
   */
  moduleAlias?: Resolve['alias']

  /**
   * 模块的扩展
   * webpack.externals
   * <https://webpack.docschina.org/configuration/externals/>
   */
  moduleExternals?: ExternalsElement[]

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

  /**
   * 初始化
   */
  constructor(props: ReactApplicationProps) {
    super('react-application', props)
    const config = this.config as ReactApplicationConfig
    this.startPort = config.startPort || 8080
    this.servePort = config.servePort || 443
    this.startPublicPath = config.startPublicPath || '/'
    this.buildPublicPath = config.buildPublicPath || '/'
    this.startProxies = config.startProxies
    this.serveProxies = config.serveProxies
    this.moduleAlias = config.moduleAlias
    this.moduleExternals = config.moduleExternals
    this.babelParseIncludes = config.babelParseIncludes
    this.babelParseExcludes = config.babelParseExcludes
  }
}
