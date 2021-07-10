import fse from 'fs-extra'
import Application, { ApplicationConfig } from './application'
import { uniqWith } from 'lodash'
import { withPath } from 'utl/path'

/**
 * 节点属性键值对
 */
export interface NodeAttrs {
  id: string
  [prop: string]: string | true
}

/**
 * 页面配置
 */
export interface PageConfig {
  /**
   * 名称（默认使用文件夹名）
   */
  name?: string

  /**
   * 页面url后缀（默认使用name）
   */
  path?: string

  /**
   * 入口文件
   */
  entry: string

  /**
   * 容器，默认是没有的
   * 若有，则会将entry作为children传入
   * 它会接收与entry相同的参数
   */
  container: string

  /**
   * 标题
   */
  title: string

  /**
   * 插入模版的meta标签
   */
  metas: NodeAttrs[]

  /**
   * 插入模版的样式列表
   */
  links: NodeAttrs[]

  /**
   * 插入模版的脚本列表
   */
  scripts: NodeAttrs[]

  /**
   * 插入模版的样式列表
   */
  styles: NodeAttrs[]
}

/**
 * 页面实例化参数
 */
export interface PageProps<
  TProject extends Application<string, ApplicationConfig<string>>
> {
  /**
   * 文件夹名称
   */
  folder: string

  /**
   * 页面所属项目
   */
  project: TProject
}

/**
 * 页面配置信息默认值
 */
export const PAGE_CONFIG: PageConfig = {
  entry: 'index.tsx',
  container: '',
  title: '',
  metas: [],
  links: [],
  scripts: [],
  styles: []
}

/**
 * 页面
 */
export default abstract class Page<
  TProject extends Application<string, ApplicationConfig<string>>,
  TPageConfig extends PageConfig
> {
  /**
   * 页面所属项目
   */
  readonly project: TProject

  /**
   * 页面ID
   */
  readonly id: string

  /**
   * 页面目录路径
   */
  readonly root: string

  /**
   * 页面名称（页面路径）
   */
  readonly name: string

  /**
   * 页面url路径（只包含非公共部分的路径）
   */
  readonly path: string

  /**
   * 页面url路径（全路径）
   */
  readonly fullPath: string

  /**
   * 页面配置信息
   */
  readonly config: TPageConfig

  /**
   * 页面配置信息（未合并过默认配置的）
   */
  protected __config__: Partial<TPageConfig>

  constructor(props: PageProps<TProject>, defaultConfig: TPageConfig) {
    const project = this.project = props.project
    this.root = project.withSrc(props.folder)
    // 提取配置文件信息
    const config: TPageConfig = { ...defaultConfig }
    const __configPath__ = this.withRoot('page.js')
    const __config__: TPageConfig = fse.existsSync(__configPath__)
      ? require(__configPath__)
      : {}
    // 设置页面的名称、路由、id
    this.path = __config__.path || props.folder
    this.name = __config__.name || this.path
    this.fullPath = props.project.joinPath(this.path)
    this.id = project.id + '_' + this.path
    // 对配置文件信息进行整理
    config.entry = __config__.entry || config.entry || 'index.tsx'
    config.entry = this.withRoot(config.entry)
    if (__config__.container) {
      config.container = this.withRoot(__config__.container)
    } else if (config.container) {
      config.container = this.project.withRoot(config.container)
    }
    config.title = __config__.title || config.title || (this.name + ' ' + project.name)
    config.metas = uniqWith((__config__.metas || []).concat(config.metas), this.compareWithId)
    config.links = uniqWith((__config__.links || []).concat(config.links), this.compareWithId)
    config.scripts = uniqWith((__config__.scripts || []).concat(config.scripts), this.compareWithId)
    config.styles = uniqWith((__config__.styles || []).concat(config.styles), this.compareWithId)
    this.config = config
    this.__config__ = __config__
  }

  /**
   * 拼接页面根路径
   */
  withRoot(...pathList: string[]) {
    return withPath(this.root, ...pathList)
  }

  /**
   * 唯一性对比（id）
   */
  protected compareWithId(a: NodeAttrs, b: NodeAttrs) {
    return a.id !== undefined && a.id === b.id
  }

  /**
   * 将节点们转换成字符串
   */
  nodesToString(label: string, nodes: NodeAttrs[]) {
    const full = ['script'].includes(label)
    return nodes.map(node => {
      const keys = Object.keys(node).filter(key => key !== 'id')
      if (keys.length <= 0) {
        return undefined
      }
      const attrs = keys.map(key => {
        if (node[key] === true) {
          return key
        } else {
          return key + '="' + node[key] + '"'
        }
      }).join(' ')
      if (full) {
        return '<' + label + ' ' + attrs + '></' + label + '>'
      } else {
        return '<' + label + ' ' + attrs + '/>'
      }
    }).filter(i => i !== undefined).join('\n')
  }
}
