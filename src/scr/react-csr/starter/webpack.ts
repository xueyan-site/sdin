import { mapValues, omit } from 'lodash'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import Webpack, { Compiler, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'
import { getPages } from '../common/page'
import { getRules } from '../common/module'

/**
 * 获取webpack配置
 * @param project 
 * @returns 
 */
export async function createWebpack(project: ReactCSR): Promise<Compiler> {
  const pages = await getPages(project, true)
  // 在开发模式下，需要确保externals中不包含react和react-dom
  // 否则，react-refresh不会生效。
  const externals = omit(project.module.externals, ['react', 'react-dom']) 
  return Webpack({
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    context: project.root,
    entry: pages.entry,
    output: {
      path: project.webDist,
      pathinfo: true,
      publicPath: project.path,
      hashDigestLength: 8,
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].js'
    },
    module: {
      rules: getRules(project, true)
    },
    externals,
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
      new HotModuleReplacementPlugin(),
      new ReactRefreshPlugin({
        overlay: {
          sockIntegration: 'whm'
        }
      }),
      new NoEmitOnErrorsPlugin(),
      ...pages.plugins
    ]
  })
}
