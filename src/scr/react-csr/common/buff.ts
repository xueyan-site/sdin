import { mapValues } from 'lodash'
import { cmdNmPath } from 'utl/path'
import { DefinePlugin } from 'webpack'
import type { ReactCSR } from 'pro/react-csr'
import type { Configuration } from 'webpack'

/**
 * 分割代码的设置
 */
export function getSplitChunks(): {
  maxSize: number,
  cacheGroups: any
} {
  return {
    maxSize: 262144,
    cacheGroups: {
      // 打包业务中公共代码
      's0202': getSplitSourceConfig('s0202', 10, 2),
      's0304': getSplitSourceConfig('s0304', 11, 3),
      's0508': getSplitSourceConfig('s0508', 12, 5),
      's0915': getSplitSourceConfig('s0915', 13, 9),
      's1626': getSplitSourceConfig('s1626', 14, 16),
      's2742': getSplitSourceConfig('s2742', 15, 27),
      's4364': getSplitSourceConfig('s4364', 16, 43),
      's6500': getSplitSourceConfig('s6500', 17, 65),
      // 打包第三方库的文件
      'm0202': getSplitModuleConfig('m0202', 20, 2),
      'm0304': getSplitModuleConfig('m0304', 21, 3),
      'm0508': getSplitModuleConfig('m0508', 22, 5),
      'm0915': getSplitModuleConfig('m0915', 23, 9),
      'm1626': getSplitModuleConfig('m1626', 24, 16),
      'm2742': getSplitModuleConfig('m2742', 25, 27),
      'm4364': getSplitModuleConfig('m4364', 26, 43),
      'm6500': getSplitModuleConfig('m6500', 27, 65)
    }
  }
}

/**
 * 获取公共源代码分割配置
 * @param priority 优先级
 * @param minCount 最少被引用多少次
 */
function getSplitSourceConfig(name: string, priority: number, minCount: number) {
  return {
    name: name,
    chunks: "initial",
    minSize: 1,
    priority: priority,
    minChunks: minCount
  }
}

/**
 * 获取外部模块分割配置
 * @param priority 优先级
 * @param minCount 最少被引用多少次
 */
function getSplitModuleConfig(name: string, priority: number, minCount: number) {
  return {
    test: /[\\/]node_modules[\\/]/,
    name: name,
    chunks: "initial",
    priority: priority,
    minChunks: minCount
  }
}

/**
 * webpack.config.resolve
 */
export function getResolve(project: ReactCSR): Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    // 指定 react 和 react-dom 的绝对路径
    // 防止出现 react 版本不一致的问题
    alias: Object.assign({
      'react': project.withMdl('react'),
      'react-dom': project.withMdl('react-dom')
    }, mapValues(project.alias, value => {
      return project.withRoot(value)
    }))
  }
}

/**
 * webpack.config.resolveLoader
 */
export function getResolveLoader(project: ReactCSR): Configuration['resolveLoader'] {
  return {
    modules: [
      project.mdl,
      cmdNmPath()
    ]
  }
}

/**
 * webpack.config.plugins define-plugin
 */
export function getDefinePlugin(project: ReactCSR, dev: boolean): DefinePlugin {
  return new DefinePlugin({
    XT_ID: JSON.stringify(project.id), // 项目ID，一般是package.name
    XT_TYPE: JSON.stringify(project.type), // 项目类型，此处是react-csr
    XT_NAME: JSON.stringify(project.name), // 项目名称
    XT_VERSION: JSON.stringify(project.version), // 项目版本
    XT_AUTHOR: JSON.stringify(project.author), // 项目作者 author <email>
    XT_AUTHOR_NAME: JSON.stringify(project.authorName), // 项目作者名称
    XT_AUTHOR_EMAIL: JSON.stringify(project.authorEmail), // 项目作者邮箱
    XT_ROOT: JSON.stringify(project.root), // 项目根目录
    XT_ENV: JSON.stringify('web'), // 项目打包结果运行环境，web、node
    XT_DEV: JSON.stringify(dev), // 项目是否以开发态进行构建，不是则代表是正式态
    XT_PUBLIC_PATH: JSON.stringify(project.publicPath), // 项目url中的公共路径（以'/'开头和结尾）
    XT_ASSETS_PATH: JSON.stringify(project.assetsPath), // 项目的素材路径（以'/'开头和结尾）
    XT_TRACK_PATH: JSON.stringify(project.trackPath), // 项目的打点路径（关闭打点后，值为""）
  })
}
