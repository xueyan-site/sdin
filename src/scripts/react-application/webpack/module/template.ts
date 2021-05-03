import { RuleSetRule } from 'webpack'

function getHtmlRule(): RuleSetRule {
  return {
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader'
      }
    ]
  }
}

export function getTemplateRules(): RuleSetRule[] {
  return [
    getHtmlRule()
  ]
}
