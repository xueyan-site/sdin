import { posix, resolve } from 'path'
import { trim, uniqWith } from 'lodash'
import { readdirSync, statSync } from 'fs-extra'
import { getJsonSync } from '../utils/read'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from './project'

export interface NodeAttrs extends Record<string, string|boolean|undefined> {
  key: string
  children?: string
}

export type ReactCSRPageSkeleton = (
  root: string,
  pkg: PackageInfo,
  pjtCfg: ReactCSRProjectConfig,
  pgCfg: ReactCSRPageConfig,
  dev: boolean
) => string

export interface ReactCSRPageConfig {
  /** 页面标识（即文件夹名）*/
  id: string
  /** 页面名称（中文、英文都可以） */
  name: string
  /** 页面 URL path */
  path: string
  /** 页面 URL path 非公共部分 */
  privatePath: string
  /** 入口文件 */
  entry: string
  /** 输出的HTML文件 */
  html: string
  /** 标题 */
  title: string
  /** 插入模版的meta标签 */
  metas: NodeAttrs[]
  /** 插入模版的样式列表 */
  links: NodeAttrs[]
  /** 插入模版的脚本列表 */
  scripts: NodeAttrs[]
  /** 插入模版的样式列表 */
  styles: NodeAttrs[]
  /** HTML骨架图渲染器 */
  skeleton: ReactCSRPageSkeleton
}

export interface ReactCSRPageUserConfig {
  name?: string
  path?: string
  entry?: string
  title?: string
  metas?: NodeAttrs[]
  links?: NodeAttrs[]
  scripts?: NodeAttrs[]
  styles?: NodeAttrs[]
  skeleton?: ReactCSRPageSkeleton
}

function getUserConfigSync(root: string): ReactCSRPageUserConfig {
  const cfg = getJsonSync(resolve(root, 'page.js')) || {}
  return cfg as any
}

function uniqNodeAttrs(a?: NodeAttrs[], b?: NodeAttrs[]): NodeAttrs[] {
  if (a && b) {
    return uniqWith(a.concat(b), (a, b) => {
      return a.id !== undefined && a.id === b.id
    })
  } else {
    return a || b || []
  }
}

interface PartProjectConfig {
  name: string
  publicPath: string
  page?: Partial<ReactCSRPageUserConfig>
}

export function getReactCSRPageConfigSync(
  root: string,
  folder: string,
  pjtCfg: PartProjectConfig
): ReactCSRPageConfig {
  const pageRoot = resolve(root, 'src', folder)
  const ucfg = getUserConfigSync(pageRoot)
  const dcfg = pjtCfg.page || {}
  const privatePath = trim(ucfg.path || folder, '/ ')
  const name = ucfg.name || folder
  return {
    id: folder,
    name,
    privatePath,
    path: posix.join(pjtCfg.publicPath, privatePath),
    entry: resolve(pageRoot, ucfg.entry || dcfg.entry || 'index.tsx'),
    html: folder + '.html',
    title: ucfg.title || dcfg.title || `${name}・${pjtCfg.name}`,
    metas: uniqNodeAttrs(ucfg.metas, dcfg.metas),
    links: uniqNodeAttrs(ucfg.links, dcfg.links),
    scripts: uniqNodeAttrs(ucfg.scripts, dcfg.scripts),
    styles: uniqNodeAttrs(ucfg.styles, dcfg.styles),
    skeleton: ucfg.skeleton || dcfg.skeleton || (() => '')
  }
}

export function getReactCSRPageConfigListSync(
  root: string,
  pjtCfg: PartProjectConfig
): ReactCSRPageConfig[] {
  const list: ReactCSRPageConfig[] = []
  const src = resolve(root, 'src')
  const files = readdirSync(src)
  for (let i = 0; i < files.length; i++) {
    if (statSync(resolve(src, files[i])).isDirectory()) {
      list.push(getReactCSRPageConfigSync(root, files[i], pjtCfg))
    }
  }
  return list
}
