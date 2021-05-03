import { Configuration } from 'webpack'
import ReactApplication from 'projects/react-application'
import { cmdNmPath } from 'utils/path'

export function getResolveLoaderConfig(project: ReactApplication): Configuration['resolveLoader'] {
  return {
    modules: [
      project.modulePath,
      cmdNmPath()
    ]
  }
}
