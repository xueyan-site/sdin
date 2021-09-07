import { mapValues } from 'lodash'
import { cmdNmPath, relativePosixPath } from 'utl/path'
import { withCache } from 'utl/read'
import type Package from 'pro/package'

/**
 * 获取自定义模块别名Babel插件
 */
function getModuleAliasPlugin(project: Package): any {
  const aliasMap = mapValues(
    project.alias || {},
    value => project.withRoot(value)
  )
  const aliasKeys = Object.keys(aliasMap)
  if (aliasKeys.length <= 0) {
    return
  }
  const resolvePath = (source: string, current: string) => {
    let matchedKey: string = ''
    for(let i = 0; i < aliasKeys.length; i++) {
      const key = aliasKeys[i]
      if (key[0] === source[0] && source.startsWith(key)) {
        matchedKey = key
        break
      }
    }
    if (!matchedKey) {
      return source
    }
    return relativePosixPath(
      project.withRoot(
        source.replace(matchedKey, aliasMap[matchedKey])
      ),
      current
    )
  }
  return [
    cmdNmPath('babel-plugin-module-resolver'),
    { resolvePath }
  ]
}

/**
 * 缓存Babel配置（便于在监听模式下，节省时间）
 */
const __getBabelOptions__ = withCache<string, AnyObject, {
  project: Package,
  target: 'web' | 'node'
}>((_key, props) => ({
  presets: [
    [cmdNmPath('@babel/preset-env'), {
      modules: props.target === 'web' ? false : 'cjs'
    }],
    props.project.useReact && cmdNmPath('@babel/preset-react'),
    cmdNmPath('@babel/preset-typescript')
  ].filter(Boolean),
  plugins: [
    getModuleAliasPlugin(props.project),
    cmdNmPath('@babel/plugin-transform-runtime')
  ].filter(Boolean)
}))

/**
 * 获取Babel配置
 */
export function getBabelOptions(project: Package, target: 'web' | 'node'): any {
  const key = project.name + target
  return __getBabelOptions__(key, { project, target })
}
