import { trimEnd, trimStart, uniqWith } from 'lodash'
import { withPath } from 'utl/path'
import { readJsonSync } from 'utl/read'
import type Application from './application'
import type { ApplicationConfig } from './application'

/**
 * 节点属性键值对
 */
export interface NodeAttrs {
  key: string
  children: string | undefined
  [prop: string]: string | boolean | undefined
}

/**
 * 页面配置
 */
export interface PageConfig {
  /**
   * 页面名称
   */
  name?: string

  /**
   * 页面url后缀
   */
  path?: string

  /**
   * 入口文件
   */
  entry?: string

  /**
   * 标题
   */
  title?: string

  /**
   * 插入模版的meta标签
   */
  metas?: NodeAttrs[]

  /**
   * 插入模版的样式列表
   */
  links?: NodeAttrs[]

  /**
   * 插入模版的脚本列表
   */
  scripts?: NodeAttrs[]

  /**
   * 插入模版的样式列表
   */
  styles?: NodeAttrs[]
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
 * 页面
 */
export default abstract class Page<
  TProject extends Application<string, ApplicationConfig<string>>,
  TConfig extends PageConfig
> {
  /**
   * 页面ID（优先使用config.path，默认使用文件夹名）
   */
  readonly id: string

  /**
   * 名称（默认使用id）
   */
  readonly name: string

  /**
   * url中的页面路径（完整，包含'/'）
   */
  readonly path: string

  /**
   * url中的页面路径（非公共路径外的路径，包含'/'）
   */
  readonly privatePath: string

  /**
   * 页面目录路径
   */
  readonly root: string

  /**
   * 页面所属项目
   */
  readonly project: TProject

  /**
   * 页面配置文件内容
   */
  protected config: TConfig

  /**
   * 入口文件（默认使用index.tsx）
   */
  readonly entry: string

  /**
   * 标题
   */
  readonly title: string

  /**
   * 插入模版的meta标签
   */
  readonly metas: NodeAttrs[]

  /**
   * 插入模版的样式列表
   */
  readonly links: NodeAttrs[]

  /**
   * 插入模版的脚本列表
   */
  readonly scripts: NodeAttrs[]

  /**
   * 插入模版的样式列表
   */
  readonly styles: NodeAttrs[]

  constructor(props: PageProps<TProject>, __config__: TConfig) {
    const project = this.project = props.project
    this.root = project.withSrc(props.folder)
    const config = this.config = readJsonSync('page.js', this.root) as any
    // 设置页面的路由、名称、id
    let __path__: string = config.path || props.folder
    if (__path__) {
      __path__ = trimEnd(trimStart(__path__, '/'), '/')
    }
    this.privatePath = '/' + __path__
    this.path = project.joinPath(this.privatePath)
    this.id = __path__.replace(/\//g, '_')
    this.name = config.name || this.id
    // 设置页面的文件入口
    this.entry = config.entry || __config__.entry || 'index.tsx'
    this.entry = this.withRoot(this.entry)
    // 设置页面标题
    this.title = config.title || __config__.title
    if (!this.title) {
      this.title = this.name + '・' + project.name
    }
    // 设置页面元信息、链接、脚本、样式
    this.metas = this.uniqNodeAttrs(config.metas, __config__.metas)
    this.links = this.uniqNodeAttrs(config.links, __config__.links)
    this.scripts = this.uniqNodeAttrs(config.scripts, __config__.scripts)
    this.styles = this.uniqNodeAttrs(config.styles, __config__.styles)
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
   * 确保节点唯一
   * @param name 
   */
  protected uniqNodeAttrs(a: NodeAttrs[] | undefined, b: NodeAttrs[] | undefined): NodeAttrs[] {
    if (a && b) {
      return uniqWith(a.concat(b), this.compareWithId)
    } else {
      return a || b || []
    }
  }

  /**
   * 将节点们转换成标签
   */
  nodesToHTML(label: string, nodes: NodeAttrs[]) {
    const full = ['script'].includes(label)
    let strs: string[] = []
    for (let i = 0, node: NodeAttrs; i < nodes.length; i++) {
      node = nodes[i]
      let attrs: string[] = []
      let children: string | undefined
      const keys = Object.keys(node)
      for (let j = 0, key: string, value: any; j < keys.length; j++) {
        key = keys[j]
        if (key === 'key') {
          continue
        }
        value = node[key]
        if (key === 'children') {
          children = value
          continue
        }
        if (value === true) {
          attrs.push(key)
        } else {
          attrs.push(key + '="' + value + '"')
        }
      }
      if (attrs.length <= 0) {
        continue
      }
      const attrstr = attrs.join(' ')
      const labelpre = '<' + label + ' ' + attrstr
      if (children) {
        strs.push(labelpre + '>' + children + '</' + label + '>')
      } else if (full) {
        strs.push(labelpre + '></' + label + '>')
      } else {
        strs.push(labelpre + '/>')
      }
    }
    return strs.join('\n')
  }
}
