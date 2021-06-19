import { mapValues } from 'lodash'
import fse from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import PostcssImport from 'postcss-import'
import PostcssPresetEnv from 'postcss-preset-env'
import Autoprefixer from 'autoprefixer'
import PostcssNormalize from 'postcss-normalize'
import Cssnano from 'cssnano'
import Webpack, { Compiler as WebpackCompiler, HotModuleReplacementPlugin } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath, withPath } from 'utl/path'
import { AnyObject } from 'types'

interface View {
  name: string
  path: string
  config: string
}




/**
 * member static
 * @param project 
 */
function getEntry(project: ReactCSR) {
  const files = fse.readdirSync(project.srcPath)
  const entry: AnyObject<string> = {}
  const views: AnyObject<View> = {}
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const filePath = project.withSrcPath(fileName)
    if (fse.statSync(filePath).isDirectory()) {
      const currPath = withPath(filePath, 'index.tsx')
      if (fse.existsSync(currPath)) {
        entry[fileName] = currPath
        views[fileName] = {
          name: fileName,
          path: filePath,
          config: fse.existsSync(currPath) ? require(currPath) : {}
        }
      }
    }
  }
}




/**
 * 生成Webpack实例
 * @param project 
 * @returns 
 */
export function createWebpack(project: ReactCSR): WebpackCompiler {
  const config = project.config
  return Webpack({
    mode: 'production',
    devtool: 'cheap-module-source-map',



    externals: {
      externalsType: 'script',
      externals: {
        react: 'https://cdn.jsdelivr.net/npm/react@16.12.0/umd/react.production.min.js',
        'react-dom': 'https://cdn.jsdelivr.net/npm/react-dom@16.12.0/umd/react-dom.production.min.js',
        classnames: 'https://cdn.jsdelivr.net/npm/classnames@2.3.1/index.min.js',
        lodash: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
        'styled-components': 'https://cdn.jsdelivr.net/npm/styled-components@5.2.1/dist/styled-components.min.js',
        'normalize.css': 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css',
      }
    },



    entry: {
      index: project.withSrcPath('views/index/index.tsx')
    },

    output: {
      path: project.webDistPath,
      publicPath: config.buildPublicPath,
      filename: 'js/[name].[fullhash:8].js',
      chunkFilename: 'js/[name].[fullhash:8].c.js'
    },

    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.json'
      ],
      alias: mapValues(
        config.moduleAlias,
        value => project.withPath(value)
      )
    },

    resolveLoader: {
      modules: [
        project.modulePath,
        cmdNmPath()
      ]
    },

    plugins: [
      new HotModuleReplacementPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: project.withPubPath('app'),
            to: project.withDistPath('app'),
            globOptions: {
              ignore: [
                '**/index.html'
              ]
            }
          }
        ]
      }) as any,
      new MiniCssExtractPlugin({
        filename: 'css/[name].[fullhash:8].css',
        chunkFilename: 'css/[name].[fullhash:8].c.css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        minify: true,
        template: project.withPubPath('app/index.html'),
        templateParameters: project
      })
    ],

    module: {
      rules: [
        {
          test: /\.(txt|md)$/i,
          use: [
            {
              loader: 'raw-loader',
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'fnt/[name].[fullhash:8].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|svg|gif|bmp|webp)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'img/[name].[fullhash:8].[ext]',
              }
            }
          ]
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: config.babelParseIncludes,
          exclude: [
            /node_modules/,
            ...(config.babelParseExcludes || [])
          ],
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
                ]
              }
            }
          ]
        },
        {
          test: /\.json$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'json-loader'
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2,
                modules: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    Autoprefixer,
                    PostcssImport(),
                    PostcssPresetEnv(),
                    PostcssNormalize(),
                    Cssnano()
                  ]
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    Autoprefixer,
                    PostcssImport(),
                    PostcssPresetEnv(),
                    PostcssNormalize(),
                    Cssnano()
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  })
}
