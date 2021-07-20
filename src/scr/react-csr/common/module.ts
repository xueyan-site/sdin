import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import PostcssImport from 'postcss-import'
import PostcssPresetEnv from 'postcss-preset-env'
import Autoprefixer from 'autoprefixer'
import Cssnano from 'cssnano'
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
    getScssRule(dev),
    getBableRule(project, dev)
  ]
}

function getTextRule() {
  return {
    test: /\.txt$/i,
    type: 'asset/source',
    generator: {
      filename: 'fnt/[name].[fullhash:8].[ext][query]'
    }
  }
}

function getFontRule() {
  return {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    type: 'asset',
    generator: {
      filename: 'fnt/[name].[fullhash:8].[ext][query]'
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
      filename: 'img/[name].[fullhash:8].[ext][query]'
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
      filename: 'ado/[name].[fullhash:8].[ext][query]'
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
      filename: 'vdo/[name].[fullhash:8].[ext][query]'
    },
    parser: {
      dataUrlCondition: {
        maxSize: 10240 // 10kb
      }
    }
  }
}

function getCssRule(dev: boolean): RuleSetRule {
  return {
    test: /\.css$/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: dev ? false : true,
          importLoaders: 1,
          modules: false
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: dev ? false : true,
          postcssOptions: {
            plugins: [
              Autoprefixer,
              PostcssImport(),
              PostcssPresetEnv(),
              dev ? Cssnano() : false
            ].filter(Boolean)
          }
        }
      }
    ]
  }
}

function getScssRule(dev: boolean): RuleSetRule {
  return {
    test: /\.scss$/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: dev ? false : true,
          importLoaders: 2,
          modules: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: dev ? false : true,
          postcssOptions: {
            plugins: [
              Autoprefixer,
              PostcssImport(),
              PostcssPresetEnv(),
              dev ? Cssnano() : false
            ].filter(Boolean)
          }
        }
      },
      {
        loader: 'sass-loader'
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
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
          babelrc: false,
          configFile: false,
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
