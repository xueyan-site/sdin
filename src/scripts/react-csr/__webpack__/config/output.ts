import { Configuration } from 'webpack'
import ReactCSR from 'projects/react-csr'
import { WebpackConfigOptions } from '../types'

export function getOutputConfig(
  project: ReactCSR,
  options: WebpackConfigOptions
): Configuration['output'] {
  const output: Configuration['output'] = {
    path: project.distPath,
    filename: 'scripts/[name].[fullhash:8].js',
    chunkFilename: 'scripts/[name].[fullhash:8].chunk.js'
  }
  if (options.isDevMode) {
    output.pathinfo = true
    output.publicPath = project.config.startPublicPath
  } else {
    output.publicPath = project.config.buildPublicPath
  }
  return output
}
