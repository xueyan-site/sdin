import fse from 'fs-extra'
import { defaultsDeep, keyBy } from 'lodash'
import { RuleSetCondition } from 'webpack'
import { Options as ProxyOptions } from 'koa-proxy'
import Application, { ApplicationProps, ApplicationConfig } from './application'
import ReactCSRPage, { ReactCSRPageConfig } from './react-csr-page'
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
   * 项目的根页面（填写的应当是页面的path）
   */
  readonly index?: string

  /**
   * 项目的错误页面（填写的应当是页面的path）
   */
  readonly error?: string

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
    this.index = config.index
    this.error = config.error
    this.module = defaultsDeep({}, config.module, {
      externals: {},
      babelIncludes: [],
      babelExcludes: []
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
    this.__pageMap__ = keyBy(this.pageList, 'path')
  }

  /**
   * 获取某一个页面
   * @returns 
   */
  getPage(name?: string): ReactCSRPage | undefined {
    return this.__pageMap__[name || '']
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
