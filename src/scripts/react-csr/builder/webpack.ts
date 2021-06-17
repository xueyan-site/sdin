import { mapValues } from 'lodash'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import PostcssImport from 'postcss-import'
import PostcssPresetEnv from 'postcss-preset-env'
import Autoprefixer from 'autoprefixer'
import PostcssNormalize from 'postcss-normalize'
import Cssnano from 'cssnano'
import Webpack, { Compiler as WebpackCompiler, HotModuleReplacementPlugin } from 'webpack'
import ReactCSR from 'projects/react-csr'
import { cmdNmPath } from 'utils/path'

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
    externals: config.moduleExternals,
    entry: {
      index: project.withSrcPath('views/index/index.tsx')
    },
    output: {
      path: project.webDistPath,
      publicPath: config.buildPublicPath,
      filename: 'scripts/[name].[fullhash:8].js',
      chunkFilename: 'scripts/[name].[fullhash:8].chunk.js'
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        'jsx',
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
            from: project.publicPath,
            to: project.distPath,
            globOptions: {
              ignore: [
                '**/index.html'
              ]
            }
          }
        ]
      }) as any,
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[fullhash:8].css',
        chunkFilename: 'styles/[name].[fullhash:8].chunk.css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        minify: true,
        template: project.withPublicPath('index.html'),
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
                name: 'fonts/[name].[fullhash:8].[ext]'
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
                name: 'images/[name].[fullhash:8].[ext]',
              }
            }
          ]
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
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
          test: /\.module\.(scss|sass)$/,
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
          test: /\.scss$/,
          exclude: /\.module\.(scss|sass)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 2,
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
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.module\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
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
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
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
