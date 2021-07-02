import fse from 'fs-extra'
import Project, { ProjectConfig } from './project'
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
  TProject extends Project<string, ProjectConfig<string>>
> {
  /**
   * 页面名称
   */
  name: string

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
  TProject extends Project<string, ProjectConfig<string>>,
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
   * 页面名称（页面路径）
   */
  readonly name: string

  /**
   * 页面根目录路径
   */
  readonly path: string

  /**
   * 页面配置信息
   */
  readonly config: TPageConfig

  /**
   * 页面配置信息（未合并过默认配置的）
   */
  protected _config: Partial<TPageConfig>

  constructor(props: PageProps<TProject>, defaultConfig: TPageConfig) {
    const name = this.name = props.name
    const project = this.project = props.project
    this.id = project.id + '_' + name
    this.path = project.withSrcPath(name)
    // 提取配置文件信息
    const config: TPageConfig = { ...defaultConfig }
    const configPath = this.withPath('page.js')
    const _config: TPageConfig = fse.existsSync(configPath)
      ? require(configPath)
      : {}
    // 对配置文件信息进行整理
    config.entry = _config.entry || config.entry || 'index.tsx'
    config.entry = this.withPath(config.entry)
    if (_config.container) {
      config.container = this.withPath(_config.container)
    } else if (config.container) {
      config.container = this.project.withPath(config.container)
    }
    config.title = _config.title || config.title || (project.name + ' ' + name)
    config.metas = uniqWith(config.metas.concat(_config.metas || []), this.compareWithId)
    config.links = uniqWith(config.links.concat(_config.links || []), this.compareWithId)
    config.scripts = uniqWith(config.scripts.concat(_config.scripts || []), this.compareWithId)
    config.styles = uniqWith(config.styles.concat(_config.styles || []), this.compareWithId)
    this.config = config
    this._config = _config
  }

  /**
   * 唯一性对比（id）
   */
  protected compareWithId(a: NodeAttrs, b: NodeAttrs) {
    return a.id !== undefined && a.id === b.id
  }

  /**
   * 拼接页面根路径
   */
  withPath(...pathList: string[]) {
    return withPath(this.path, ...pathList)
  }

  /**
   * 将节点们转换成字符串
   * @param full 是否写全，默认不写全
   */
  nodesToString(label: string, nodes: NodeAttrs[], full?: boolean) {
    return nodes.map(node => {
      const attrs = Object.keys(node)
        .filter(key => key !== 'id')
        .map(key => {
          if (node[key] === true) {
            return key
          } else {
            return key + '="' + node[key] + '"'
          }
        })
        .join(' ')
      if (full) {
        return '<' + label + ' ' + attrs + '></' + label + '>'
      } else {
        return '<' + label + ' ' + attrs + '/>'
      }
    }).join('\n')
  }
}
