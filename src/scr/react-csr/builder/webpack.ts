import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactCSR from 'pro/react-csr'
import { getPages } from '../common/page'
import { getRules } from '../common/module'
import { getDefinePlugin, getResolve, getResolveLoader, getSplitChunks } from '../common/buff'
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
      publicPath: project.publicPath,
      hashDigestLength: 12,
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[id].[chunkhash].js'
    },
    module: {
      rules: getRules(project, false)
    },
    externals: project.module.externals,
    resolve: getResolve(project),
    resolveLoader: getResolveLoader(project),
    plugins: [
      new ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css'
      }),
      getDefinePlugin(project, false),
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
