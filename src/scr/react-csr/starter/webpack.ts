import { mapValues } from 'lodash'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'
import { getPages } from '../common/page'
import { getRules } from '../common/module'
import Webpack, { Compiler, HotModuleReplacementPlugin } from 'webpack'

/**
 * 获取webpack配置
 * @param project 
 * @returns 
 */
export async function createWebpack(project: ReactCSR): Promise<Compiler> {
  const config = project.config
  const { module } = project.config
  const pages = await getPages(project, false)
  return Webpack({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: pages.entry,
    output: {
      path: project.webDist,
      pathinfo: true,
      publicPath: project.path,
      filename: 'js/[name].[fullhash:8].js',
      chunkFilename: 'js/[name].[fullhash:8].m.js'
    },
    module: {
      rules: getRules(project, true)
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
        return project.withRoot(value)
      })
    },
    resolveLoader: {
      modules: [
        project.mdl,
        cmdNmPath()
      ]
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      ...pages.plugins
    ],
    optimization: {
      // 运行时代码
      runtimeChunk: {
        name: 'manifest'
      },
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
      }
    }
  })
}
