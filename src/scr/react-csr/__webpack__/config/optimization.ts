import { Configuration } from 'webpack'
import { WebpackConfigOptions } from '../types'

export function getOptimizationConfig(options: WebpackConfigOptions): Configuration['optimization'] {
  const optimization: Configuration['optimization'] = {
    runtimeChunk: {
      name: (entrypoint: any) => `runtime-${entrypoint.name}`,
    }
  }
  if (options.isDevMode) {
    optimization.emitOnErrors = false
    optimization.splitChunks = {
      chunks: 'all',
      name: false,
    }
  } else {
    optimization.minimize = true
    optimization.splitChunks = {
      chunks: 'all',
    }
  }
  return optimization
}
