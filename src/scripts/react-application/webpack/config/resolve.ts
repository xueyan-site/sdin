import { Configuration } from 'webpack'
import { mapValues } from 'lodash'
import ReactApplication from 'projects/react-application'

export function getResolveConfig(project: ReactApplication): Configuration['resolve'] {
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
