import { omit } from 'lodash'
import { resolve } from 'path'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import Webpack, { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin }  from 'webpack'
import {
  getWebpackPageListConfig,
  getWebpackDefinePlugin,
  getWebpackResolve,
  getWebpackResolveLoader,
  getWebpackRules
} from '../react-csr'
import { getDepVersion, PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'
import type { Compiler } from 'webpack'

export async function createCompiler(
  root: string,
  pkg: PackageInfo,
  cfg: ReactCSRProjectConfig
): Promise<Compiler> {
  const pgsCfg = await getWebpackPageListConfig(root, pkg, cfg, true)
  // 在开发模式下，需尽可能使用本地的包（减少CDN包，去除网络带来的阻碍）
  const externals = omit(
    cfg.module.externals,
    Object.keys(cfg.module.externals).filter(i => getDepVersion(pkg, i))
  )
  return Webpack({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    context: root,
    entry: pgsCfg.entry,
    output: {
      path: resolve(root, 'dist'),
      pathinfo: true,
      publicPath: cfg.publicPath,
      hashDigestLength: 10,
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].js'
    },
    module: {
      rules: getWebpackRules(root, cfg, true)
    },
    externals,
    resolve: getWebpackResolve(root, cfg),
    resolveLoader: getWebpackResolveLoader(root),
    plugins: [
      new HotModuleReplacementPlugin(),
      new ReactRefreshPlugin({
        overlay: {
          sockIntegration: 'whm'
        }
      }),
      getWebpackDefinePlugin(root, pkg, cfg, true),
      new NoEmitOnErrorsPlugin(),
      ...pgsCfg.plugins
    ]
  })
}
