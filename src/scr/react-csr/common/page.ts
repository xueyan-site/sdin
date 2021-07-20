import fse from 'fs-extra'
import { WebpackPluginInstance } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactCSR from 'pro/react-csr'
import { AnyObject } from 'types'
import { getScriptString } from './script'
import { getTemplateString } from './template'

/**
 * wepback-hot-middleware client script
 */
const WHM_CLIENT_SCRIPT = 'webpack-hot-middleware/client'

/**
 * 获取入口配置信息
 * @param start 是否开发状态
 * @returns 
 */
export async function getPages(project: ReactCSR, dev: boolean) {
  const tasks: Promise<void>[] = []
  const entry: AnyObject<string|string[]> = {}
  const plugins: WebpackPluginInstance[] = []
  project.pageList.forEach(page => {
    const swpIdxPath = project.withBuf('entry', page.path + '.jsx')
    tasks.push(fse.outputFile(swpIdxPath, getScriptString(page, dev)))
    // 设定入口（为了配合热更新，在开发时，需要加入热更新脚本）
    entry[page.path] = dev 
      ? [
        WHM_CLIENT_SCRIPT + `?name=${page.path}`, swpIdxPath]
      : swpIdxPath
    // 设定模版
    plugins.push(new HtmlWebpackPlugin({
      minify: true,
      inject: true,
      chunks: [page.path],
      filename: page.path + '.html',
      templateContent: getTemplateString(page, dev)
    }))
  })
  await Promise.all(tasks)
  return {
    entry,
    plugins
  }
}
