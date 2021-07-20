import { mapValues } from 'lodash'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
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
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
      new NoEmitOnErrorsPlugin(),
      ...pages.plugins
    ]
  })
}
