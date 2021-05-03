import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReactApplication from 'projects/react-application'
import { WebpackConfigOptions } from '../types'

export function getPluginsConfig(
  project: ReactApplication,
  options: WebpackConfigOptions
): Configuration['plugins'] {
  const config: Configuration['plugins'] = []
  if (options.isDevMode) {
    config.push(new HotModuleReplacementPlugin())
  }
  config.push(new CleanWebpackPlugin())
  if (!options.isDevMode) {
    config.push(new CopyWebpackPlugin({
      patterns: [
        {
          from: project.publicPath,
          to: project.distPath,
          globOptions: {
            ignore: [
              'index.html'
            ]
          }
        }
      ]
    }) as any)
  }
  if (!options.isDevMode) {
    config.push(new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash:8].css',
      chunkFilename: 'styles/[name].[hash:8].chunk.css',
    }))
  }
  config.push(new HtmlWebpackPlugin({
    inject: true,
    minify: true,
    template: project.withPublicPath('index.html'),
    templateParameters: project
  }))
  return config
}
