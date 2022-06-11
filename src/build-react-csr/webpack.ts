import { resolve } from 'path'
import Webpack, { ProgressPlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import {
  getWebpackPageListConfig,
  getWebpackDefinePlugin,
  getWebpackResolve,
  getWebpackResolveLoader,
  getWebpackSplitChunks,
  getWebpackRules
} from '../react-csr'
import type { Compiler } from 'webpack'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'

export async function createCompiler(
  root: string,
  pkg: PackageInfo,
  cfg: ReactCSRProjectConfig
): Promise<Compiler> {
  const pgsCfg = await getWebpackPageListConfig(root, pkg, cfg, false)
  return Webpack({
    mode: 'production',
    devtool: false,
    context: root,
    entry: pgsCfg.entry,
    output: {
      path: resolve(root, 'dist'),
      publicPath: cfg.publicPath,
      hashDigestLength: 10,
      filename: 'js/[name].[chunkhash].js',
      chunkFilename: 'js/[id].[chunkhash].js'
    },
    module: {
      rules: getWebpackRules(root, cfg, false)
    },
    externals: cfg.module.externals,
    resolve: getWebpackResolve(root, cfg),
    resolveLoader: getWebpackResolveLoader(root),
    plugins: [
      new ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css'
      }),
      getWebpackDefinePlugin(root, pkg, cfg, false),
      ...pgsCfg.plugins
    ],
    optimization: {
      splitChunks: getWebpackSplitChunks(),
      runtimeChunk: {
        name: (entry: any) => entry.name + '.rc'
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
      maxEntrypointSize: 1048576,
    }
  })
}
