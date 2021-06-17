import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ReactCSR from 'projects/react-csr'
import { WebpackConfigOptions } from '../types'

export function getPluginsConfig(
  project: ReactCSR,
  options: WebpackConfigOptions
): Configuration['plugins'] {
  const plugins: Configuration['plugins'] = []
  if (options.isDevMode) {
    plugins.push(new HotModuleReplacementPlugin())
  }
  plugins.push(new CleanWebpackPlugin())
  if (!options.isDevMode) {
    plugins.push(new CopyWebpackPlugin({
      patterns: [
        {
          from: project.publicPath,
          to: project.distPath,
          globOptions: {
            ignore: [
              '**/index.html'
            ]
          }
        }
      ]
    }) as any)
  }
  if (!options.isDevMode) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'styles/[name].[fullhash:8].css',
      chunkFilename: 'styles/[name].[fullhash:8].chunk.css',
    }))
  }
  plugins.push(new HtmlWebpackPlugin({
    inject: true,
    minify: true,
    template: project.withPublicPath('index.html'),
    templateParameters: project
  }))
  return plugins
}
