import { RuleSetRule } from 'webpack'

function getImageRule(): RuleSetRule {
  return {
    test: /\.(png|jpg|jpeg|svg|gif|bmp|webp)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[fullhash:8].[ext]',
        }
      }
    ]
  }
}

function getFontRule(): RuleSetRule {
  return {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[fullhash:8].[ext]'
        }
      }
    ]
  }
}

function getRawRule(): RuleSetRule {
  return {
    test: /\.(txt|md)$/i,
    use: [
      {
        loader: 'raw-loader',
      }
    ]
  }
}

export function getAssetsRules(): RuleSetRule[] {
  return [
    getImageRule(),
    getFontRule(),
    getRawRule()
  ]
}
