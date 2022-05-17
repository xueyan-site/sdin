import { defaultsDeep } from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { cmdNmPath } from 'utl/path'
import type { ReactCSR } from 'pro/react-csr'
import type { RuleSetRule } from 'webpack'

/**
 * 获取webpack的loader配置
 * @param project 
 * @param dev 
 * @returns 
 */
export function getRules(project: ReactCSR, dev: boolean): RuleSetRule[] {
  return [
    getRowRule(project),
    getFontRule(project),
    getImageRule(project),
    getAudioRule(project),
    getVideoRule(project),
    ...project.module.loaders,
    getCssRule(dev),
    getScssRule(project, dev),
    getBableRule(project, dev)
  ]
}

function getRowRule(project: ReactCSR) {
  return defaultsDeep({
    type: 'asset/source',
    generator: {
      filename: '_raw/[name].[contenthash][ext]'
    }
  }, project.module.rules.raw, {
    test: /\.txt$/i
  })
}

function getFontRule(project: ReactCSR) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: '_fnt/[name].[contenthash][ext]'
    }
  }, project.module.rules.font, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/
  })
}

function getImageRule(project: ReactCSR) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: '_img/[name].[contenthash][ext]'
    }
  }, project.module.rules.image, {
    test: /\.(png|jpg|jpeg|svg|webp|gif|bmp|tif)(\?.*)?$/,
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  })
}

function getAudioRule(project: ReactCSR) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: '_ado/[name].[contenthash][ext]'
    }
  }, project.module.rules.audio, {
    test: /\.(mp3|wma|wav|aac|amr|ogg)(\?.*)?$/
  })
}

function getVideoRule(project: ReactCSR) {
  return defaultsDeep({
    type: 'asset',
    generator: {
      filename: '_vdo/[name].[contenthash][ext]'
    }
  }, project.module.rules.video, {
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
              cmdNmPath('postcss-import'),
              cmdNmPath('postcss-preset-env')
            ]
          }
        }
      }
    ]
  }
}

function getScssRule(project: ReactCSR, dev: boolean): RuleSetRule {
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
            localIdentName: dev ? '[local]_[hash:base64:8]' : '[hash:base64:12]',
            localIdentContext: project.root
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: dev,
          postcssOptions: {
            plugins: [
              cmdNmPath('postcss-import'),
              cmdNmPath('postcss-preset-env')
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

function getBableRule(project: ReactCSR, dev: boolean): RuleSetRule {
  const { babelIncludes, babelExcludes } = project.module
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
            cmdNmPath('@babel/preset-env'),
            cmdNmPath('@babel/preset-react'),
            cmdNmPath('@babel/preset-typescript'),
          ],
          plugins: [
            cmdNmPath('@babel/plugin-transform-runtime'),
            dev && cmdNmPath('react-refresh/babel')
          ].filter(Boolean)
        }
      }
    ]
  }
}
