import { mapValues } from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'
import { getPages } from '../common/page'
import { getRules } from '../common/module'
import { Configuration, ProgressPlugin } from 'webpack'

/**
 * 获取webpack配置
 * @param project 
 * @returns 
 */
export async function getWebpackConfig(project: ReactCSR): Promise<Configuration> {
  const config = project.config
  const { module, serve } = project.config
  const pages = await getPages(project, false)
  return {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    entry: pages.entry,
    output: {
      path: project.webDistPath,
      publicPath: serve.path,
      filename: 'js/[name].[fullhash:8].js',
      chunkFilename: 'js/[name].[fullhash:8].m.js'
    },
    module: {
      rules: getRules(project, false)
    },
    externals: module.externals,
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.json'
      ],
      alias: mapValues(config.alias, value => {
        return project.withPath(value)
      })
    },
    resolveLoader: {
      modules: [
        project.mdlPath,
        cmdNmPath()
      ]
    },
    plugins: [
      new ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[fullhash:8].css',
        chunkFilename: 'css/[name].[fullhash:8].m.css',
      }),
      ...pages.plugins
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          // 打包业务中公共代码
          common: {
            name: "common",
            chunks: "initial",
            minSize: 1,
            priority: 0,
            minChunks: 2, // 同时引用了2次才打包
          },
          // 打包第三方库的文件
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "initial",
            priority: 10,
            minChunks: 2, // 同时引用了2次才打包
          }
        }
      },
      // 运行时代码
      runtimeChunk: {
        name: 'manifest'
      }
    }
  }
}