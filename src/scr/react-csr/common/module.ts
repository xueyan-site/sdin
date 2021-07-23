import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'
import { RuleSetRule } from 'webpack'

/**
 * 获取webpack的loader配置
 * @param project 
 * @param dev 
 * @returns 
 */
export function getRules(project: ReactCSR, dev: boolean): RuleSetRule[] {
  return [
    getTextRule(),
    getFontRule(),
    getImageRule(),
    getAudioRule(),
    getVideoRule(),
    getCssRule(dev),
    getScssRule(project, dev),
    getBableRule(project, dev)
  ]
}

function getTextRule() {
  return {
    test: /\.txt$/i,
    type: 'asset/source',
    generator: {
      filename: 'raw/[name].[contenthash].[ext]'
    }
  }
}

function getFontRule() {
  return {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    type: 'asset',
    generator: {
      filename: 'fnt/[name].[contenthash].[ext]'
    },
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  }
}

function getImageRule() {
  return {
    test: /\.(png|jpg|jpeg|svg|gif|bmp|webp|tif)(\?.*)?$/,
    type: 'asset',
    generator: {
      filename: 'img/[name].[contenthash].[ext]'
    },
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  }
}

function getAudioRule() {
  return {
    test: /\.(mp3|wma|wav|aac|amr|ogg)(\?.*)?$/,
    type: 'asset',
    generator: {
      filename: 'ado/[name].[contenthash].[ext]'
    },
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  }
}

function getVideoRule() {
  return {
    test: /\.(mp4|3gp|mpg|avi|wmv|flv)(\?.*)?$/,
    type: 'asset',
    generator: {
      filename: 'vdo/[name].[contenthash].[ext]'
    },
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  }
}

function getCssRule(dev: boolean): RuleSetRule {
  const sourceMap = dev ? false : true
  return {
    test: /\.css$/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap,
          importLoaders: 1,
          modules: false
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap,
          postcssOptions: {
            plugins: [
              'postcss-import',
              'postcss-preset-env',
              dev ? false : 'cssnano'
            ].filter(Boolean)
          }
        }
      }
    ]
  }
}

function getScssRule(project: ReactCSR, dev: boolean): RuleSetRule {
  const sourceMap = dev ? false : true
  return {
    test: /\.scss$/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap,
          importLoaders: 2,
          modules: {
            exportLocalsConvention: "camelCase",
            localIdentName: dev ? '[path][name]_[local]' : '[hash:base64:12]',
            localIdentContext: project.root
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap,
          postcssOptions: {
            plugins: [
              'postcss-import',
              'postcss-preset-env',
              dev ? false : 'cssnano'
            ].filter(Boolean)
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap
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
            cmdNmPath('@babel/plugin-proposal-class-properties'),
            dev && cmdNmPath('react-refresh/babel')
          ].filter(Boolean)
        }
      }
    ]
  }
}
