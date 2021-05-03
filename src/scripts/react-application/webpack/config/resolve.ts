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
    resolve.alias = mapValues(config.moduleAlias, value => {
      if (typeof value === 'string') {
        return project.withPath(value)
      } else if (Array.isArray(value)) {
        return value.map(sub => project.withPath(sub))
      } else {
        return value
      }
    })
  }
  return resolve
}
