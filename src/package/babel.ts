import { resolve } from 'path'
import { mapValues } from 'lodash'
import { PackageProjectConfig } from '../package'
import { CMD_PATH, relativePosix } from '../utils/path'

/**
 * 获取自定义模块别名Babel插件
 */
function getModuleAliasPlugin(
  root: string,
  cfg: PackageProjectConfig
): any {
  const map = mapValues(cfg.alias, value => resolve(root, value))
  const keys = Object.keys(map)
  if (keys.length <= 0) {
    return
  }
  const resolvePath = (source: string, current: string) => {
    let matchedKey: string = ''
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key[0] === source[0] && source.startsWith(key)) {
        matchedKey = key
        break
      }
    }
    if (!matchedKey) {
      return source
    }
    return relativePosix(
      current,
      resolve(root, source.replace(matchedKey, map[matchedKey]))
    )
  }
  return [
    resolve(CMD_PATH, 'node_modules/babel-plugin-module-resolver'),
    { resolvePath }
  ]
}

/**
 * 获取Babel配置
 */
export function getBabelOptions(
  root: string,
  cfg: PackageProjectConfig,
  target: 'web' | 'node'
): any {
  return {
    presets: [
      [resolve(CMD_PATH, 'node_modules/@babel/preset-env'), {
        modules: target === 'web' ? false : 'cjs'
      }],
      cfg.useReact && resolve(CMD_PATH, 'node_modules/@babel/preset-react'),
      resolve(CMD_PATH, 'node_modules/@babel/preset-typescript')
    ].filter(Boolean),
    plugins: [
      getModuleAliasPlugin(root, cfg),
      resolve(CMD_PATH, 'node_modules/@babel/plugin-transform-runtime')
    ].filter(Boolean)
  }
}
