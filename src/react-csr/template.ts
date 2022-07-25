import { getDepVersion } from '../utils/package'
import { twoBracesReplacer } from '../utils/write'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from './project'
import type { ReactCSRPageConfig, NodeAttrs } from './page'

/**
 * 将节点们转换成标签
 */
function nodesToHTML(label: string, nodes: NodeAttrs[], variables: Record<string, string>) {
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
        children = twoBracesReplacer(value, variables)
        continue
      }
      if (value === true) {
        attrs.push(key)
      } else {
        attrs.push(key + '="' + twoBracesReplacer(value, variables) + '"')
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

export function getTemplateString(
  root: string,
  pkg: PackageInfo,
  prjCfg: ReactCSRProjectConfig,
  pgCfg: ReactCSRPageConfig,
  dev: boolean
) {
  let { title, scripts } = pgCfg
  if (dev) {
    title = '⚡️' + pgCfg.title
    // 在开发模式下，需尽可能使用本地的包（减少CDN包，去除网络带来的阻碍）
    scripts = pgCfg.scripts.filter(i => !getDepVersion(pkg, i.key))
  }
  const P_PAGE = {
    id: pgCfg.id,
    name: pgCfg.name,
    path: pgCfg.path,
    publicPath: prjCfg.publicPath,
    assetsPath: prjCfg.assetsPath,
    privatePath: pgCfg.privatePath
  }
  const VARIABLES = {
    P_ID: prjCfg.id, // 项目ID，一般是package.name
    P_TYPE: prjCfg.type, // 项目类型，此处是react-csr
    P_NAME: prjCfg.name, // 项目名称
    P_VERSION: pkg.version, // 项目版本
    P_AUTHOR: pkg.author, // 项目作者 author <email>
    P_AUTHOR_NAME: pkg.authorName, // 项目作者名称
    P_AUTHOR_EMAIL: pkg.authorEmail, // 项目作者邮箱
    P_PUBLIC_PATH: prjCfg.publicPath, // 项目url中的公共路径（以'/'开头和结尾）
    P_ASSETS_PATH: prjCfg.assetsPath, // 项目的素材路径（以'/'开头和结尾）
  }
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        ${nodesToHTML('meta', pgCfg.metas, VARIABLES)}
        <title>${title}</title>
        <script>window.P_PAGE=${JSON.stringify(P_PAGE)}</script>
        ${nodesToHTML('link', pgCfg.links, VARIABLES)}
        ${nodesToHTML('script', scripts, VARIABLES)}
        ${nodesToHTML('link', pgCfg.styles, VARIABLES)}
      </head>
      <body>
        <div id="app">
          ${pgCfg.skeleton(root, pkg, prjCfg, pgCfg, dev)}
        </div>
      </body>
    </html>
  `
}
