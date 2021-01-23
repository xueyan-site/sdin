import ora from 'ora'
import NodeApplicationProject from '../../projects/node-application-project'
import { copyProjectTemplate } from '../../utils/write'
import { withPath } from '../../utils/path'
import { executeSync } from '../../utils/exec'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: NodeApplicationProject) {
  const copyOra = ora('copying project template').start()
  await copyProjectTemplate(project)
  copyOra.succeed('copy project template successfully')
  /**
   * 下载node_modules
   */
  const downloadOra = ora('downloading node modules').start()
  executeSync(`cd ${project.path} && yarn`)
  downloadOra.succeed(`downloaded node modules successfully`)
  /**
   * 下载 doc node_modules
   */
  const downloadDocOra = ora('downloading doc node modules').start()
  executeSync(`cd ${withPath(project.path, 'doc')} && yarn`)
  downloadDocOra.succeed(`downloaded doc node modules successfully`)
  /**
   * 初始化git
   */
  const initGitOra = ora('initializing git repository').start()
  executeSync(`cd ${project.path} && git init && git add . && git commit -m "chore: project created"`)
  initGitOra.succeed(`initialized git repository successfully`)
}
