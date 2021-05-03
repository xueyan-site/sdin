import { RuleSetRule, RuleSetUseItem } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import PostcssImport from 'postcss-import'
import PostcssPresetEnv from 'postcss-preset-env'
import Autoprefixer from 'autoprefixer'
import PostcssNormalize from 'postcss-normalize'
import Cssnano from 'cssnano'
import { WebpackConfigOptions } from '../types'

function getStyleLoader(options: WebpackConfigOptions): RuleSetUseItem {
  return {
    loader: options.isDevMode 
      ? 'style-loader' 
      : MiniCssExtractPlugin.loader,
  }
}

function getCssLoader(
  options: WebpackConfigOptions,
  loaderOptions: {
    modules: boolean
    importLoaders: number
  }
): RuleSetUseItem {
  return {
    loader: 'css-loader',
    options: {
      sourceMap: options.isDevMode ? false : true,
      ...loaderOptions
    }
  }
}

function getPostcssLoader(options: WebpackConfigOptions): RuleSetUseItem {
  return {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.isDevMode ? false : true,
      postcssOptions: {
        plugins: options.isDevMode ? [
          Autoprefixer,
          PostcssImport(),
          PostcssPresetEnv(),
          PostcssNormalize()
        ] : [
          Autoprefixer,
          PostcssImport(),
          PostcssPresetEnv(),
          PostcssNormalize(),
          Cssnano()
        ]
      }
    }
  }
}

function getCssRule(options: WebpackConfigOptions): RuleSetRule {
  return {
    test: /\.css$/,
    exclude: /\.module\.css$/,
    use: [
      getStyleLoader(options),
      getCssLoader(options, {
        importLoaders: 1,
        modules: false
      }),
      getPostcssLoader(options)
    ]
  }
}

function getCssModuleRule(options: WebpackConfigOptions): RuleSetRule {
  return {
    test: /\.module\.css$/,
    use: [
      getStyleLoader(options),
      getCssLoader(options, {
        importLoaders: 1,
        modules: true
      }),
      getPostcssLoader(options)
    ]
  }
}

function getSassRule(options: WebpackConfigOptions): RuleSetRule {
  return {
    test: /\.scss$/,
    exclude: /\.module\.(scss|sass)$/,
    use: [
      getStyleLoader(options),
      getCssLoader(options, {
        importLoaders: 2,
        modules: false
      }),
      getPostcssLoader(options),
      {
        loader: 'sass-loader'
      }
    ]
  }
}

function getSassModuleRule(options: WebpackConfigOptions): RuleSetRule {
  return {
    test: /\.module\.(scss|sass)$/,
    use: [
      getStyleLoader(options),
      getCssLoader(options, {
        importLoaders: 2,
        modules: true
      }),
      getPostcssLoader(options),
      {
        loader: 'sass-loader'
      }
    ]
  }
}

export function getStyleRules(options: WebpackConfigOptions): RuleSetRule[] {
  return [
    getCssRule(options),
    getCssModuleRule(options),
    getSassRule(options),
    getSassModuleRule(options)
  ]
}
