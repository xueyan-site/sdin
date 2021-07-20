import fse from 'fs-extra'
import { defaultsDeep, keyBy } from 'lodash'
import { RuleSetCondition } from 'webpack'
import Application, { ApplicationProps, ApplicationConfig } from './application'
import ReactCSRPage, { ReactCSRPageConfig, REACT_CSR_PAGE_CONFIG } from './react-csr-page'
import { AnyObject } from 'types'

/**
 * react-csr应用类型
 */
export type ReactCSRType = 'react-csr'

export const REACT_CSR_TYPE: ReactCSRType = 'react-csr'

/**
 * react-csr 模块配置信息
 */
export interface ReactCSRModuleConfig {
  /**
   * 模块扩展
   */
  externals: AnyObject<string>

  /**
   * 模块的扩展
   * webpack.externals
   * <https://webpack.docschina.org/configuration/externals/>
   */
  babelIncludes: RuleSetCondition[]

  /**
   * 模块的扩展
   * webpack.externals
   * <https://webpack.docschina.org/configuration/externals/>
   */
  babelExcludes: RuleSetCondition[]
}

const REACT_CSR_MODULE_CONFIG: ReactCSRModuleConfig = {
  externals: {},
  babelIncludes: [],
  babelExcludes: []
}

/**
 * react-csr 服务配置信息
 */
export interface ReactCSRServeConfig {
  /**
   * 启动的端口
   * <http://expressjs.com/en/4x/api.html#app.listen>
   */
  port: number

  /**
   * 代理设置
   * <https://webpack.docschina.org/configuration/dev-server/#devserverproxy>
   */
  proxy: any[]
}

const REACT_CSR_SERVE_CONFIG: ReactCSRServeConfig = {
  port: 443,
  proxy: []
}

/**
 * react-csr 开发配置信息
 */
export interface ReactCSRStartConfig extends ReactCSRServeConfig {}

const REACT_CSR_START_CONFIG: ReactCSRStartConfig = {
  ...REACT_CSR_SERVE_CONFIG,
  port: 8080
}

/**
 * react-csr 配置信息
 */
export interface ReactCSRConfig extends ApplicationConfig<ReactCSRType> {
  /**
   * 页面的全局默认配置
   */
  page: ReactCSRPageConfig

  /**
   * react-csr 模块配置信息
   */
  module: ReactCSRModuleConfig

  /**
   * react-csr 服务配置信息
   */
  serve: ReactCSRServeConfig

  /**
   * react-csr 服务配置信息（开发时期）
   */
  start: ReactCSRStartConfig
}

/**
 * react-csr应用配置信息默认值
 */
export const REACT_CSR_CONFIG: ReactCSRConfig = {
  type: REACT_CSR_TYPE,
  name: '',
  path: '/',
  index: '',
  error: '',
  page: REACT_CSR_PAGE_CONFIG,
  module: REACT_CSR_MODULE_CONFIG,
  serve: REACT_CSR_SERVE_CONFIG,
  start: REACT_CSR_START_CONFIG
}

/**
 * react-csr应用实例化参数
 */
export interface ReactCSRProps extends ApplicationProps<
  ReactCSRType, 
  ReactCSRConfig
> {}

/**
 * react-csr应用
 */
export default class ReactCSR extends Application<
  ReactCSRType, 
  ReactCSRConfig
> {
  /**
   * 项目原始的公共资源文件目录
   */
  readonly astPub: string

  /**
   * 页面列表
   */
  readonly pageList: ReactCSRPage[] = []

  /**
   * 页面映射表
   */
  private readonly pageMap: AnyObject<ReactCSRPage> = {}

  constructor(props: ReactCSRProps) {
    super(props, REACT_CSR_CONFIG)
    this.astPub = this.withPub('ast')
    this.pageList = this.getPageList()
    this.pageMap = keyBy(this.pageList, 'name')
    const { start, serve } = this.config
    this.config.start = defaultsDeep({}, start, serve)
  }

  /**
   * 获取某一个页面
   * @returns 
   */
  getPage(name: string): ReactCSRPage | undefined {
    return this.pageMap[name]
  }

  /**
   * 获取页面列表
   * @param project 
   */
  private getPageList() {
    const pages: ReactCSRPage[] = []
    const files = fse.readdirSync(this.src)
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      const filePath = this.withSrc(fileName)
      if (fse.statSync(filePath).isDirectory()) {
        pages.push(new ReactCSRPage({
          folder: fileName,
          project: this
        }))
      }
    }
    return pages
  }
}
