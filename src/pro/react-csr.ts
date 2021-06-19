import { ProxyConfigArrayItem } from 'webpack-dev-server'
import { Configuration, RuleSetCondition } from 'webpack'
import Project, { ProjectProps, ProjectConfig } from 'pro/project'

/**
 * react应用类型
 */
export type ReactCSRType = 'react-csr'

export const REACT_CSR_TYPE: ReactCSRType = 'react-csr'

/**
 * react应用配置信息
 */
export interface ReactCSRConfig extends ProjectConfig<ReactCSRType> {
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
export const REACT_CSR_CONFIG: ReactCSRConfig = {
  type: REACT_CSR_TYPE,
  startPort: 8080,
  servePort: 443,
  startPublicPath: '/',
  buildPublicPath: '/'
}

/**
 * react应用实例化参数
 */
export interface ReactCSRProps extends ProjectProps<
  ReactCSRType, 
  ReactCSRConfig
> {}

/**
 * react应用
 */
export default class ReactCSR extends Project<
  ReactCSRType, 
  ReactCSRConfig
> {
  constructor(props: ReactCSRProps) {
    super(props, REACT_CSR_CONFIG)
  }
}
