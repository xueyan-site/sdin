import { posix, resolve } from 'path'
import { defaultsDeep, isObject, keyBy, trim } from 'lodash'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import { ReactCSRPageUserConfig, ReactCSRPageConfig, getReactCSRPageConfigListSync } from './page'
import type { PackageInfo } from '../utils/package'
import type { ClientOptions as ESClientOptions } from '@elastic/elasticsearch'
import type { RuleSetCondition, RuleSetRule } from 'webpack'
import type { Options as ProxyOptions } from 'koa-proxy'

interface ReactCSRDevelopConfig {
  /** 启动的端口 */
  port: number
  /** 代理设置 <https://github.com/edorivai/koa-proxy> */
  proxies: ProxyOptions[]
}

interface ReactCSRServeConfig {
  /** 启动的端口 */
  port: number
  /** 代理设置 <https://github.com/edorivai/koa-proxy> */
  proxies: ProxyOptions[]
  /** SSL 私钥文件路径 */
  SSLKey?: string
  /** SSL 证书文件路径 */
  SSLCert?: string
}

interface ReactCSRModuleConfigRules {
  raw?: Partial<RuleSetRule>
  font?: Partial<RuleSetRule>
  image?: Partial<RuleSetRule>
  audio?: Partial<RuleSetRule>
  video?: Partial<RuleSetRule>
}

interface ReactCSRModuleConfig {
  /** 模块扩展 */
  externals: Record<string, string>
  /** babel 编译包含项 */
  babelIncludes: RuleSetCondition[]
  /** babel 编译排除项 */
  babelExcludes: RuleSetCondition[]
  /** 修改现有模块规则（仅允许修改部分值）*/
  rules: ReactCSRModuleConfigRules
  /** 自定义模块规则 */
  loaders: RuleSetRule[]
}

export interface ReactCSRProjectConfig {
  /** 项目类型 */
  type: 'react-csr'
  /** 项目标识（即包名）*/
  id: string
  /** 项目名称（中文、英文都可以）*/
  name: string
  /** 
   * 模块的alias
   * webpack.resolve.alias | babel-plugin-module-resolver.alias
   * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
   * <https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md>
   */
  alias: Record<string, string>
  /**
   * 项目 URL path 公共部分
   * <https://webpack.docschina.org/configuration/output/#outputpublicpath> 
   */
  publicPath: string
  /** 素材路径 */
  assetsPath: string
  /** 模块配置信息 */
  module: ReactCSRModuleConfig
  /** 服务配置信息（开发时期）*/
  develop: ReactCSRDevelopConfig
  /** 服务配置信息 */
  serve: ReactCSRServeConfig
  /** 所有页面 */
  pageList: ReactCSRPageConfig[]
  /** 项目的根页面 */
  index?: ReactCSRPageConfig
  /** 错误页面 */
  error?: ReactCSRPageConfig
  /** 打点请求 URL path（若有，则代表开启了打点） */
  trackPath: string
  /** 打点功能的配置参数 */
  trackOptions?: ESClientOptions
}

export interface ReactCSRProjectUserConfig {
  type: 'react-csr'
  name?: string
  alias?: Record<string, string>
  path?: string
  index?: string
  error?: string
  track?: boolean | ESClientOptions
  start?: Partial<ReactCSRDevelopConfig>
  develop?: Partial<ReactCSRDevelopConfig>
  serve?: Partial<ReactCSRServeConfig>
  module?: Partial<ReactCSRModuleConfig>
  page?: Partial<ReactCSRPageUserConfig>
}

function getUserConfigSync(root: string): ReactCSRProjectUserConfig {
  const ucfg = getJsonSync(resolve(root, 'project.js'), true)
  if (ucfg.type !== 'react-csr') {
    printExit('project config file format error')
  }
  return ucfg as any
}

export function getReactCSRProjectConfigSync(
  root: string, 
  pkg: PackageInfo
): ReactCSRProjectConfig {
  const ucfg = getUserConfigSync(root)
  const name = ucfg.name || pkg.name
  const _path = trim(ucfg.path || '', '/ ')
  const publicPath = _path ? `/${_path}/` : '/'
  const module = defaultsDeep({}, ucfg.module, {
    externals: {},
    babelIncludes: [],
    babelExcludes: [],
    rules: {},
    loaders: []
  })
  const _serve = ucfg.serve || {}
  const serve = defaultsDeep({}, _serve, {
    port: (_serve.SSLKey && _serve.SSLCert) ? 443 : 80,
    proxies: []
  })
  const develop = defaultsDeep({}, ucfg.start, ucfg.develop, {
    port: 8080,
    proxies: serve.proxies
  })
  const pageList = getReactCSRPageConfigListSync(root, {
    name,
    publicPath,
    page: ucfg.page
  })
  const path2Page = keyBy(pageList, 'privatePath')
  return {
    type: 'react-csr',
    id: pkg.name,
    name,
    alias: ucfg.alias || {},
    publicPath,
    assetsPath: posix.join(publicPath, 'ast/'),
    module,
    serve,
    develop,
    pageList,
    index: ucfg.index ? path2Page[trim(ucfg.index, '/ ')] : undefined,
    error: ucfg.error ? path2Page[trim(ucfg.error, '/ ')] : undefined,
    trackPath: ucfg.track ? posix.join(publicPath, 't.gif') : '',
    trackOptions: ucfg.track && isObject(ucfg.track) ? ucfg.track : undefined
  }
}
