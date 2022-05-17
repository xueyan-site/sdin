import fse from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { cmdNmPath } from 'utl/path'
import { getScriptString } from './script'
import { getTemplateString } from './template'
import type { ReactCSR } from 'pro/react-csr'
import type { WebpackPluginInstance } from 'webpack'

/**
 * 获取入口配置信息
 * @param start 是否开发状态
 * @returns 
 */
export async function getPages(project: ReactCSR, dev: boolean) {
  const tasks: Promise<void>[] = []
  const entry: Record<string, string|string[]> = {}
  const plugins: WebpackPluginInstance[] = []
  const HMR_CLIENT = cmdNmPath('webpack-hot-middleware/client?reload=true')
  project.pageList.forEach(page => {
    const swpIdxPath = project.withBuf('entry', page.id + '.jsx')
    tasks.push(fse.outputFile(swpIdxPath, getScriptString(page)))
    // 设定入口（为了配合热更新，在开发时，需要加入热更新脚本）
    if (dev) {
      entry[page.id] = [HMR_CLIENT, swpIdxPath]
    } else {
      entry[page.id] = swpIdxPath
    }
    // 设定模版
    plugins.push(new HtmlWebpackPlugin({
      minify: true,
      inject: true,
      chunks: [page.id],
      filename: page.id + '.html',
      templateContent: getTemplateString(page, dev)
    }))
  })
  await Promise.all(tasks)
  return {
    entry,
    plugins
  }
}
