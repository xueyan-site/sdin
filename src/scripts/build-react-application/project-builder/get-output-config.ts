import { withPath } from '../../../utils/path'
import ProjectBuilder from './index'
import { Configuration } from 'webpack'

/**
 * 入口
 * @param configInfo 
 */
export default function getOutputConfig(builder: ProjectBuilder): Configuration['output'] {
  const project = builder.project
  return {
    publicPath: project.buildPublicPath,
    path: withPath(project.path, 'dist'),
    filename: 'scripts/[name].[hash:8].js',
    chunkFilename: 'scripts/[name].[hash:8].chunk.js'
  }
}
