import { Configuration as ServerOptions } from 'webpack-dev-server'
import ReactCSR from 'pro/react-csr'

export function getServerConfig(project: ReactCSR): ServerOptions {
  const { start } = project.config
  return {
    hot: true,
    hotOnly: true,
    compress: true,
    stats: 'errors-warnings',
    contentBase: start.path,
    open: true,
    proxy: start.proxy
  }
}
