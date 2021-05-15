import { Configuration } from 'webpack'
import ReactCSR from 'projects/react-csr'

export function getEntryConfig(project: ReactCSR): Configuration['entry'] {
  return {
    index: project.withSrcPath('index.tsx')
  }
}
