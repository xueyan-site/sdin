import { Configuration } from 'webpack'
import ReactApplication from 'projects/react-application'
import { WebpackConfigOptions } from '../types'

export function getOutputConfig(
  project: ReactApplication,
  options: WebpackConfigOptions
): Configuration['output'] {
  const config: Configuration['output'] = {
    path: project.distPath,
    filename: 'scripts/[name].[fullhash:8].js',
    chunkFilename: 'scripts/[name].[fullhash:8].chunk.js'
  }
  if (options.isDevMode) {
    config.pathinfo = true
    config.publicPath = project.config.startPublicPath
  } else {
    config.publicPath = project.config.buildPublicPath
  }
  return config
}
