import { Configuration } from 'webpack'
import { mapValues } from 'lodash'
import ReactCSR from 'pro/react-csr'

export function getResolveConfig(project: ReactCSR): Configuration['resolve'] {
  const config = project.config
  const resolve: Configuration['resolve'] = {
    extensions: [
      '.tsx',
      '.ts',
      'jsx',
      '.js',
      '.json'
    ]
  }
  if (project.config.moduleAlias) {
    resolve.alias = mapValues(
      config.moduleAlias,
      value => project.withPath(value)
    )
  }
  return resolve
}
