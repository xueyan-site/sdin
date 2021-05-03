import { Configuration } from 'webpack'
import { WebpackConfigOptions } from '../types'

export function getOptimizationConfig(options: WebpackConfigOptions): Configuration['optimization'] {
  const config: Configuration['optimization'] = {
    runtimeChunk: {
      name: (entrypoint: any) => `runtime-${entrypoint.name}`,
    }
  }
  if (options.isDevMode) {
    config.emitOnErrors = false
    config.splitChunks = {
      chunks: 'all',
      name: false,
    }
  } else {
    config.minimize = true
    config.splitChunks = {
      chunks: 'all',
    }
  }
  return config
}
