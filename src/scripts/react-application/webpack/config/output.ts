import { Configuration } from 'webpack'
import ReactApplication from 'projects/react-application'
import { WebpackConfigOptions } from '../types'

export function getOutputConfig(
  project: ReactApplication,
  options: WebpackConfigOptions
): Configuration['output'] {
  const config: Configuration['output'] = {
    filename: 'scripts/[name].[hash:8].js',
    chunkFilename: 'scripts/[name].[hash:8].chunk.js'
  }
  if (options.isDevMode) {
    config.pathinfo = true
    config.publicPath = project.config.startPublicPath
  } else {
    config.path = project.distPath
    config.publicPath = project.config.buildPublicPath
  }
  return config
}
