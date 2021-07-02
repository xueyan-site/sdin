import fse from 'fs-extra'
import { WebpackPluginInstance } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactCSR from 'pro/react-csr'
import { AnyObject } from 'types'
import { getScriptString } from './script'
import { getTemplateString } from './template'
import del from 'del'

/**
 * 获取入口配置信息
 * @param start 是否开发状态
 * @returns 
 */
export async function getPages(project: ReactCSR, start: boolean) {
  const tasks: Promise<void>[] = []
  const entry: AnyObject<string> = {}
  const plugins: WebpackPluginInstance[] = []
  project.pageList.forEach(page => {
    const swpIdxPath = project.withBufPath('entry', page.name + '.jsx')
    tasks.push(fse.outputFile(swpIdxPath, getScriptString(page, start)))
    // 设定入口
    entry[page.name] = swpIdxPath
    // 设定模版
    plugins.push(new HtmlWebpackPlugin({
      minify: true,
      inject: true,
      chunks: [page.name],
      filename: page.name + '.html',
      templateContent: getTemplateString(page, start)
    }))
  })
  await del(project.withBufPath('entry'))
  await Promise.all(tasks)
  return {
    entry,
    plugins
  }
}
