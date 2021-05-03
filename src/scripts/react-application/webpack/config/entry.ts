import { Configuration } from 'webpack'
import ReactApplication from 'projects/react-application'

export function getEntryConfig(project: ReactApplication): Configuration['entry'] {
  return {
    index: project.withSrcPath('index.tsx')
  }
}
