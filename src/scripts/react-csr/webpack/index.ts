import { Configuration as WebpackOptions } from 'webpack'
import { Configuration as WebpackDevServerOptions } from 'webpack-dev-server'
import ReactCSR from 'projects/react-csr'
import { getModuleConfig } from './config/module'
import { getPluginsConfig } from './config/plugins'
import { getEntryConfig } from './config/entry'
import { getOutputConfig } from './config/output'
import { getResolveConfig } from './config/resolve'
import { getResolveLoaderConfig } from './config/resolve-loader'
import { getOptimizationConfig } from './config/optimization'
import { WebpackConfigOptions } from './types'

export function getWebpackConfig(
  project: ReactCSR,
  options: WebpackConfigOptions
) {
  const config: WebpackOptions = {}
  if (options.isDevMode) {
    config.mode = 'development'
    config.devtool = 'eval-cheap-module-source-map'
  } else {
    config.mode = 'production'
    config.devtool = 'cheap-module-source-map'
  }
  config.entry = getEntryConfig(project)
  config.output = getOutputConfig(project, options)
  config.module = getModuleConfig(project, options)
  config.plugins = getPluginsConfig(project, options)
  config.resolve = getResolveConfig(project)
  config.resolveLoader = getResolveLoaderConfig(project)
  config.optimization = getOptimizationConfig(options)
  config.externals = project.config.moduleExternals
  return config
}

export function getWebpackDevServerConfig(project: ReactCSR) {
  const config: WebpackDevServerOptions = {}
  config.hot = true
  config.compress = true
  config.stats = 'errors-warnings'
  config.contentBase = project.publicPath
  config.historyApiFallback = true
  config.open = true
  config.proxy = project.config.startProxies
  return config
}
