import { mapValues } from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'
import { getPages } from '../common/page'
import { getRules } from '../common/module'
import { getSplitChunks } from '../common/optimize'
import Webpack, { Compiler, ProgressPlugin } from 'webpack'

/**
 * 创建webpack实例
 * @param project 
 * @returns 
 */
export async function createWebpack(project: ReactCSR): Promise<Compiler> {
  const pages = await getPages(project, false)
  return Webpack({
    mode: 'production',
    devtool: 'cheap-module-source-map',
    context: project.root,
    entry: pages.entry,
    output: {
      path: project.webDist,
      publicPath: project.path,
      hashDigestLength: 12,
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[id].[chunkhash].js'
    },
    module: {
      rules: getRules(project, false)
    },
    externals: project.module.externals,
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.json'
      ],
      alias: mapValues(project.alias, value => {
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
      new ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css'
      }),
      ...pages.plugins
    ],
    optimization: {
      runtimeChunk: {
        name: (entry: any) => entry.name + '-rc'
      },
      splitChunks: getSplitChunks()
    }
  })
}
