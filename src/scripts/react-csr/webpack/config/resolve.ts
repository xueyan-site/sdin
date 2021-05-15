import { Configuration } from 'webpack'
import { mapValues } from 'lodash'
import ReactCSR from 'projects/react-csr'

export function getResolveConfig(project: ReactCSR): Configuration['resolve'] {
  const config = project.config
  const resolve: Configuration['resolve'] = {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.json',
      '.mjs'
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
