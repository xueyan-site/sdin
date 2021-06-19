import { Configuration, RuleSetRule } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { getAssetsRules } from '../module/assets'
import { getScriptRules } from '../module/script'
import { getStyleRules } from '../module/style'
import { WebpackConfigOptions } from '../types'

export function getModuleConfig(
  project: ReactCSR,
  options: WebpackConfigOptions
): Configuration['module'] {
  return {
    rules: Array<RuleSetRule>().concat(
      getScriptRules(project),
      getStyleRules(options),
      getAssetsRules()
    ).filter(Boolean)
  }
}
