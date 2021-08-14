import fse from 'fs-extra'
import { defaultsDeep, keyBy } from 'lodash'
import Application from './application'
import ReactCSRPage from './react-csr-page'
import type { RuleSetCondition, RuleSetRule } from 'webpack'
import type { Options as ProxyOptions } from 'koa-proxy'
import type { ApplicationProps, ApplicationConfig } from './application'
import type { ReactCSRPageConfig } from './react-csr-page'

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

  /**
   * 修改现有模块规则（仅允许修改部分值）
   */
  rules: {
    row?: Partial<RuleSetRule>
    font?: Partial<RuleSetRule>
    image?: Partial<RuleSetRule>
    audio?: Partial<RuleSetRule>
    video?: Partial<RuleSetRule>
  }

  /**
   * 自定义模块规则
   */
  loaders: RuleSetRule[]
}

/**
 * react-csr 服务配置信息
 */
export interface ReactCSRServeConfig {
  /**
   * 启动的端口
   */
  port: number

  /**
   * 代理设置
   * <https://github.com/edorivai/koa-proxy>
   */
  proxies: ProxyOptions[]
}

/**
 * react-csr 开发配置信息
 */
export interface ReactCSRStartConfig extends ReactCSRServeConfig {}

/**
 * react-csr 配置信息
 */
export interface ReactCSRConfig extends ApplicationConfig<ReactCSRType> {
  /**
   * 项目的根页面
   */
  index?: string

  /**
   * 错误页面
   */
  error?: string

  /**
   * 是否开启打点功能，默认开启
   */
  track?: boolean

  /**
   * 页面的全局默认配置
   */
  page?: Partial<ReactCSRPageConfig>

  /**
   * 模块配置信息
   */
  module?: Partial<ReactCSRModuleConfig>

  /**
   * 服务配置信息
   */
  serve?: Partial<ReactCSRServeConfig>

  /**
   * 服务配置信息（开发时期）
   */
  start?: Partial<ReactCSRStartConfig>
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
   * 项目的根页面
   */
  readonly index?: ReactCSRPage

  /**
   * 项目的错误页面
   */
  readonly error?: ReactCSRPage

  /**
   * 模块配置信息
   */
  readonly module: ReactCSRModuleConfig

  /**
   * 服务配置信息
   */
  readonly serve: ReactCSRServeConfig

  /**
   * 服务配置信息（开发时期）
   */
  readonly start: ReactCSRStartConfig

  /**
   * 打点路径（为空，则不能打点）
   */
  readonly trackPath: string

  /**
   * 页面的全局默认配置
   */
  readonly __pageConfig__: ReactCSRPageConfig

  /**
   * 页面列表
   */
  readonly pageList: ReactCSRPage[] = []

  /**
   * 页面映射表
   */
  private __pageMap__: AnyObject<ReactCSRPage> = {}

  constructor(props: ReactCSRProps) {
    super(REACT_CSR_TYPE, props)
    const config = this.config
    this.astPub = this.withPub('ast')
    // 设置项目的页面全局配置，模块、服务、开发等配置信息
    this.module = defaultsDeep({}, config.module, {
      externals: {},
      babelIncludes: [],
      babelExcludes: [],
      rules: {},
      loaders: []
    })
    this.serve = defaultsDeep({}, config.serve, {
      port: 443,
      proxies: []
    })
    this.start = defaultsDeep({}, config.start, {
      ...this.serve,
      port: 8080
    })
    // 设置项目的页面
    const isExistProject = fse.existsSync(props.root)
    this.__pageConfig__ = config.page || {}
    this.pageList = isExistProject ? this.getPageList() : []
    this.__pageMap__ = keyBy(this.pageList, 'id')
    this.index = this.getPage(config.index)
    this.error = this.getPage(config.error)
    // 设置打点路径
    this.trackPath = config.track !== false ? this.joinPath('t.gif') : ''
  }

  /**
   * 获取某一个页面
   * @returns 
   */
  getPage(id?: string): ReactCSRPage | undefined {
    return this.__pageMap__[id || '']
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
