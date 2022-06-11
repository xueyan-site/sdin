import fse from 'fs-extra'
import { resolve } from 'path'
import { DefinePlugin } from 'webpack'
import { mapValues, defaultsDeep } from 'lodash'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { CMD_PATH } from '../utils/path'
import { getScriptString } from './script'
import { getTemplateString } from './template'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from './project'
import type { WebpackPluginInstance, Configuration, RuleSetRule } from 'webpack'

export async function getWebpackPageListConfig(
  root: string,
  pkg: PackageInfo,
  cfg: ReactCSRProjectConfig,
  dev: boolean
) {
  const tasks: Promise<void>[] = []
  const entry: Record<string, string|string[]> = {}
  const plugins: WebpackPluginInstance[] = []
  const HMR_CLIENT = resolve(CMD_PATH, 'node_modules/webpack-hot-middleware/client?reload=true')
  cfg.pageList.forEach(pgCfg => {
    const swpIdx = resolve(root, `buf/entry/${pgCfg.id}.jsx`)
    tasks.push(fse.outputFile(swpIdx, getScriptString(pgCfg)))
    entry[pgCfg.id] = dev ? [HMR_CLIENT, swpIdx] : swpIdx
    plugins.push(new HtmlWebpackPlugin({
      minify: true,
      inject: true,
      chunks: [pgCfg.id],
      filename: pgCfg.html,
      templateContent: getTemplateString(root, pkg, cfg, pgCfg, dev)
    }))
  })
  await Promise.all(tasks)
  return {
    entry,
    plugins
  }
}


/**
 * 分割代码的设置
 */
export function getWebpackSplitChunks(): {
  maxSize: number,
  cacheGroups: any
} {
  return {
    maxSize: 524288,
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
export function getWebpackResolve(
  root: string,
  cfg: ReactCSRProjectConfig,
): Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    // 指定 react 和 react-dom 的绝对路径
    // 防止出现 react 版本不一致的问题
    alias: {
      'react': resolve(root, 'node_modules/react'),
      'react-dom': resolve(root, 'node_modules/react-dom'),
      ...mapValues(cfg.alias, value => resolve(root, value))
    }
  }
}

/**
 * webpack.config.resolveLoader
 */
export function getWebpackResolveLoader(root: string): Configuration['resolveLoader'] {
  return {
    modules: [
      resolve(root, 'node_modules'),
      resolve(CMD_PATH, 'node_modules')
    ]
  }
}

/**
 * webpack.config.plugins define-plugin
 */
export function getWebpackDefinePlugin(
  root: string,
  pkg: PackageInfo,
  cfg: ReactCSRProjectConfig,
  dev: boolean
): DefinePlugin {
  return new DefinePlugin({
    XT_ID: JSON.stringify(cfg.id), // 项目ID，一般是package.name
    XT_TYPE: JSON.stringify(cfg.type), // 项目类型，此处是react-csr
    XT_NAME: JSON.stringify(cfg.name), // 项目名称
    XT_VERSION: JSON.stringify(pkg.version), // 项目版本
    XT_AUTHOR: JSON.stringify(pkg.author), // 项目作者 author <email>
    XT_AUTHOR_NAME: JSON.stringify(pkg.authorName), // 项目作者名称
    XT_AUTHOR_EMAIL: JSON.stringify(pkg.authorEmail), // 项目作者邮箱
    XT_ROOT: JSON.stringify(root), // 项目根目录
    XT_ENV: JSON.stringify('web'), // 项目打包结果运行环境，web、node
    XT_DEV: JSON.stringify(dev), // 项目是否以开发态进行构建，不是则代表是正式态
    XT_PUBLIC_PATH: JSON.stringify(cfg.publicPath), // 项目url中的公共路径（以'/'开头和结尾）
    XT_ASSETS_PATH: JSON.stringify(cfg.assetsPath), // 项目的素材路径（以'/'开头和结尾）
    XT_TRACK_PATH: JSON.stringify(cfg.trackPath), // 项目的打点路径（关闭打点后，值为""）
  })
}

/**
 * 获取webpack的loader配置
 * @param project 
 * @param dev 
 * @returns 
 */
 export function getWebpackRules(
  root: string, 
  cfg: ReactCSRProjectConfig, 
  dev: boolean
): RuleSetRule[] {
  return [
    getRowRule(cfg),
    getFontRule(cfg),
    getImageRule(cfg),
    getAudioRule(cfg),
    getVideoRule(cfg),
    ...cfg.module.loaders,
    getCssRule(dev),
    getScssRule(root, dev),
    getBableRule(cfg, dev)
  ]
}

function getRowRule(cfg: ReactCSRProjectConfig) {
  return defaultsDeep({
    type: 'asset/source',
    generator: {
      filename: 'raw/[name].[contenthash][ext]'
    }
  }, cfg.module.rules.raw, {
    test: /\.txt$/i
  })
}

function getFontRule(cfg: ReactCSRProjectConfig) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: 'fnt/[name].[contenthash][ext]'
    }
  }, cfg.module.rules.font, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/
  })
}

function getImageRule(cfg: ReactCSRProjectConfig) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: 'img/[name].[contenthash][ext]'
    }
  }, cfg.module.rules.image, {
    test: /\.(png|jpg|jpeg|svg|webp|gif|bmp|tif)(\?.*)?$/,
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  })
}

function getAudioRule(cfg: ReactCSRProjectConfig) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: 'ado/[name].[contenthash][ext]'
    }
  }, cfg.module.rules.audio, {
    test: /\.(mp3|wma|wav|aac|amr|ogg)(\?.*)?$/
  })
}

function getVideoRule(cfg: ReactCSRProjectConfig) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: 'vdo/[name].[contenthash][ext]'
    }
  }, cfg.module.rules.video, {
    test: /\.(mp4|3gp|webm|mpg|avi|wmv|flv)(\?.*)?$/
  })
}

function getCssRule(dev: boolean): RuleSetRule {
  return {
    test: /\.css$/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: dev,
          importLoaders: 1,
          modules: false
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: dev,
          postcssOptions: {
            plugins: [
              resolve(CMD_PATH, 'node_modules/postcss-import'),
              resolve(CMD_PATH, 'node_modules/postcss-preset-env'),
            ]
          }
        }
      }
    ]
  }
}

function getScssRule(root: string, dev: boolean): RuleSetRule {
  return {
    test: /\.scss$/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: dev,
          importLoaders: 2,
          modules: {
            exportLocalsConvention: "camelCase",
            localIdentName: dev ? '[local]_[hash:base64:6]' : '[hash:base64:9]',
            localIdentContext: root
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: dev,
          postcssOptions: {
            plugins: [
              resolve(CMD_PATH, 'node_modules/postcss-import'),
              resolve(CMD_PATH, 'node_modules/postcss-preset-env'),
            ]
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: dev
        }
      }
    ]
  }
}

function getBableRule(cfg: ReactCSRProjectConfig, dev: boolean): RuleSetRule {
  const { babelIncludes, babelExcludes } = cfg.module
  const rule: Partial<RuleSetRule> = {}
  if (babelIncludes.length > 0) {
    rule.include = babelIncludes
  }
  rule.exclude = [/node_modules/]
  if (babelExcludes.length > 0) {
    rule.exclude = rule.exclude.concat(babelExcludes)
  }
  return {
    ...rule,
    test: /\.(js|jsx|ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          compact: false,
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          cacheCompression: false,
          presets: [
            resolve(CMD_PATH, 'node_modules/@babel/preset-env'),
            resolve(CMD_PATH, 'node_modules/@babel/preset-react'),
            resolve(CMD_PATH, 'node_modules/@babel/preset-typescript'),
          ],
          plugins: [
            resolve(CMD_PATH, 'node_modules/@babel/plugin-transform-runtime'),
            dev && resolve(CMD_PATH, 'node_modules/react-refresh/babel'),
          ].filter(Boolean)
        }
      }
    ]
  }
}
