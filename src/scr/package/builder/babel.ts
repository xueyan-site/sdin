import { AnyObject } from 'types'
import { cmdNmPath, relativePath } from 'utl/path'
import Package from 'pro/package'
import { mapValues } from 'lodash'

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
    return relativePath(
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
const optionsMap: AnyObject = {}

/**
 * 获取Babel配置
 */
export function getBabelOptions(project: Package, target: 'web' | 'node'): any {
  const key = project.name + target
  let options = optionsMap[key]
  if (!options) {
    options = {
      presets: [
        [cmdNmPath('@babel/preset-env'), {
          modules: target === 'web' ? false : 'cjs'
        }],
        project.useReact && cmdNmPath('@babel/preset-react'),
        cmdNmPath('@babel/preset-typescript')
      ].filter(Boolean),
      plugins: [
        getModuleAliasPlugin(project),
        cmdNmPath('@babel/plugin-transform-runtime'),
        cmdNmPath('@babel/plugin-proposal-class-properties')
      ].filter(Boolean)
    }
    optionsMap[key] = options
  }
  return options
}
