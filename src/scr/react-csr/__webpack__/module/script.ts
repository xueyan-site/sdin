import { RuleSetRule, RuleSetCondition } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'

function getBableRule(project: ReactCSR): RuleSetRule {
  const { babelParseIncludes, babelParseExcludes } = project.config
  let exclude: RuleSetCondition[] = [/node_modules/]
  if (babelParseExcludes) {
    exclude = exclude.concat(babelParseExcludes)
  }
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: babelParseIncludes,
    exclude,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
          babelrc: false,
          configFile: false,
          presets: [
            cmdNmPath('@babel/preset-env'),
            cmdNmPath('@babel/preset-react'),
            cmdNmPath('@babel/preset-typescript'),
          ],
          plugins: [
            cmdNmPath('@babel/plugin-proposal-class-properties'),
          ]
        }
      }
    ]
  }
}

function getJsonRule(): RuleSetRule {
  return {
    test: /\.json$/,
    type: 'javascript/auto',
    use: [
      {
        loader: 'json-loader'
      }
    ]
  }
}

export function getScriptRules(project: ReactCSR): RuleSetRule[] {
  return [
    getBableRule(project),
    getJsonRule()
  ]
}
