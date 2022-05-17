import { omit } from 'lodash'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import Webpack, { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack'
import { getPages } from '../common/page'
import { getRules } from '../common/module'
import { getDefinePlugin, getResolve, getResolveLoader } from '../common/buff'
import type { Compiler } from 'webpack'
import type { ReactCSR } from 'pro/react-csr'

/**
 * 获取webpack配置
 * @param project 
 * @returns 
 */
export async function createWebpack(project: ReactCSR): Promise<Compiler> {
  const pages = await getPages(project, true)
  // 在开发模式下，需尽可能使用本地的包（减少CDN包，去除网络带来的阻碍）
  const externals = omit(
    project.module.externals,
    Object.keys(project.module.externals).filter(i => project.getDepVersion(i))
  )
  return Webpack({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    context: project.root,
    entry: pages.entry,
    output: {
      path: project.dist,
      pathinfo: true,
      publicPath: project.publicPath,
      hashDigestLength: 12,
      filename: '_js/[name].js',
      chunkFilename: '_js/[id].js'
    },
    module: {
      rules: getRules(project, true)
    },
    externals,
    resolve: getResolve(project),
    resolveLoader: getResolveLoader(project),
    plugins: [
      new HotModuleReplacementPlugin(),
      new ReactRefreshPlugin({
        overlay: {
          sockIntegration: 'whm'
        }
      }),
      getDefinePlugin(project, true),
      new NoEmitOnErrorsPlugin(),
      ...pages.plugins
    ]
  })
}
