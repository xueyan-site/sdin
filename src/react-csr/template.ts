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
  pjtCfg: ReactCSRProjectConfig,
  pgCfg: ReactCSRPageConfig,
  dev: boolean
) {
  let { title, scripts } = pgCfg
  if (dev) {
    title = '⚡️' + pgCfg.title
    // 在开发模式下，需尽可能使用本地的包（减少CDN包，去除网络带来的阻碍）
    scripts = pgCfg.scripts.filter(i => !getDepVersion(pkg, i.key))
  }
  const XT_PAGE = {
    id: pgCfg.id,
    name: pgCfg.name,
    path: pgCfg.path,
    publicPath: pjtCfg.publicPath,
    assetsPath: pjtCfg.assetsPath,
    privatePath: pgCfg.privatePath
  }
  const VARIABLES = {
    XT_ID: pjtCfg.id, // 项目ID，一般是package.name
    XT_TYPE: pjtCfg.type, // 项目类型，此处是react-csr
    XT_NAME: pjtCfg.name, // 项目名称
    XT_VERSION: pkg.version, // 项目版本
    XT_AUTHOR: pkg.author, // 项目作者 author <email>
    XT_AUTHOR_NAME: pkg.authorName, // 项目作者名称
    XT_AUTHOR_EMAIL: pkg.authorEmail, // 项目作者邮箱
    XT_PUBLIC_PATH: pjtCfg.publicPath, // 项目url中的公共路径（以'/'开头和结尾）
    XT_ASSETS_PATH: pjtCfg.assetsPath, // 项目的素材路径（以'/'开头和结尾）
  }
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        ${nodesToHTML('meta', pgCfg.metas, VARIABLES)}
        <title>${title}</title>
        <script>window.XT_PAGE=${JSON.stringify(XT_PAGE)}</script>
        ${nodesToHTML('link', pgCfg.links, VARIABLES)}
        ${nodesToHTML('script', scripts, VARIABLES)}
        ${nodesToHTML('link', pgCfg.styles, VARIABLES)}
      </head>
      <body>
        <div id="app">
          ${pgCfg.skeleton(root, pkg, pjtCfg, pgCfg, dev)}
        </div>
      </body>
    </html>
  `
}
