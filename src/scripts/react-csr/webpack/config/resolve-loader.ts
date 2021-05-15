import { Configuration } from 'webpack'
import ReactCSR from 'projects/react-csr'
import { cmdNmPath } from 'utils/path'

export function getResolveLoaderConfig(project: ReactCSR): Configuration['resolveLoader'] {
  return {
    modules: [
      project.modulePath,
      cmdNmPath()
    ]
  }
}
