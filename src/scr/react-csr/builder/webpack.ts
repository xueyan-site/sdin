import Webpack, { Compiler, ProgressPlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { ReactCSR } from 'pro/react-csr'
import { getPages } from '../common/page'
import { getRules } from '../common/module'
import { getDefinePlugin, getResolve, getResolveLoader, getSplitChunks } from '../common/buff'

/**
 * 创建webpack实例
 * @param project 
 * @returns 
 */
export async function createWebpack(project: ReactCSR): Promise<Compiler> {
  const pages = await getPages(project, false)
  return Webpack({
    mode: 'production',
    devtool: false,
    context: project.root,
    entry: pages.entry,
    output: {
      path: project.dist,
      publicPath: project.publicPath,
      hashDigestLength: 12,
      filename: '_js/[name].[chunkhash].js',
      chunkFilename: '_js/[id].[chunkhash].js'
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
        filename: '_css/[name].[contenthash].css',
        chunkFilename: '_css/[id].[contenthash].css'
      }),
      getDefinePlugin(project, false),
      ...pages.plugins
    ],
    optimization: {
      splitChunks: getSplitChunks(),
      runtimeChunk: {
        name: (entry: any) => entry.name + '-rc'
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          minify: TerserPlugin.uglifyJsMinify,
          terserOptions: {
            compress: true,
            mangle: true
          },
        }),
      ],
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 2097152,
    }
  })
}
