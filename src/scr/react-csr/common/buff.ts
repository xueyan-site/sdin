import { mapValues } from 'lodash'
import { cmdNmPath } from 'utl/path'
import { DefinePlugin } from 'webpack'
import type ReactCSR from 'pro/react-csr'
import type { Configuration } from 'webpack'

/**
 * 分割代码的设置
 * @param project 
 * @returns 
 */
export function getSplitChunks(): { cacheGroups: any } {
  return {
    cacheGroups: {
      // 打包业务中公共代码
      'src-02-04': getSplitSourceConfig('src-02-04', 10, 2),
      'src-05-09': getSplitSourceConfig('src-05-09', 11, 5),
      'src-10-16': getSplitSourceConfig('src-10-16', 12, 10),
      'src-17-25': getSplitSourceConfig('src-17-25', 13, 17),
      'src-26-36': getSplitSourceConfig('src-26-36', 14, 26),
      'src-37-47': getSplitSourceConfig('src-37-47', 15, 37),
      'src-48-xx': getSplitSourceConfig('src-48-xx', 16, 48),
      // 打包第三方库的文件
      'mdl-02-04': getSplitModuleConfig('mdl-02-04', 20, 2),
      'mdl-05-09': getSplitModuleConfig('mdl-05-09', 21, 5),
      'mdl-10-16': getSplitModuleConfig('mdl-10-16', 22, 10),
      'mdl-17-25': getSplitModuleConfig('mdl-17-25', 23, 17),
      'mdl-26-36': getSplitModuleConfig('mdl-26-36', 24, 26),
      'mdl-37-47': getSplitModuleConfig('mdl-37-47', 25, 37),
      'mdl-48-xx': getSplitModuleConfig('mdl-48-xx', 26, 48)
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
 * @param project 
 * @returns 
 */
export function getResolve(project: ReactCSR): Configuration['resolve'] {
  return {
    extensions: [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json'
    ],
    // 指定react和react-dom的绝对路径
    // 防止出现react版本不一致的问题
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
 * @param project 
 * @returns 
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
 * @param project 
 * @returns 
 */
export function getDefinePlugin(project: ReactCSR, dev: boolean): DefinePlugin {
  return new DefinePlugin({
    XT_ID: JSON.stringify(project.id), // 项目ID，一般是package.name
    XT_TYPE: JSON.stringify(project.type), // 项目类型，此处是react-csr
    XT_ENV: JSON.stringify('web'), // 项目打包结果运行环境，web、node
    XT_DEV: JSON.stringify(dev), // 项目是否以开发态进行构建，不是则代表是正式态
    XT_NAME: JSON.stringify(project.name), // 项目名称
    XT_AUTHOR: JSON.stringify(project.author), // 项目作者 author <email>
    XT_AUTHOR_NAME: JSON.stringify(project.authorName), // 项目作者名称
    XT_AUTHOR_EMAIL: JSON.stringify(project.authorEmail), // 项目作者邮箱
    XT_VERSION: JSON.stringify(project.version), // 项目版本
    XT_ROOT: JSON.stringify(project.root), // 项目根目录
    XT_PATH: JSON.stringify(project.publicPath), // 项目url中的公共路径（以'/'开头和结尾）
    XT_TRACK_PATH: JSON.stringify(project.trackPath), // 项目打点的路径（关闭打点后，值为""）
  })
}
