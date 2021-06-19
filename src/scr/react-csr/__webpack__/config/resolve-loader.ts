import { Configuration } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { cmdNmPath } from 'utl/path'

export function getResolveLoaderConfig(project: ReactCSR): Configuration['resolveLoader'] {
  return {
    modules: [
      project.modulePath,
      cmdNmPath()
    ]
  }
}
