import { Configuration } from 'webpack'
import ReactApplication from 'projects/react-application'

export function getResolveLoaderConfig(project: ReactApplication): Configuration['resolveLoader'] {
  return {
    modules: [
      project.modulePath
    ]
  }
}
