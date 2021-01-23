import ora from 'ora'
import ReactApplicationProject from '../../projects/react-application-project'
import { copyProjectTemplate } from '../../utils/write'
import { executeSync } from '../../utils/exec'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: ReactApplicationProject) {
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
   * 初始化git
   */
  const initGitOra = ora('initializing git repository').start()
  executeSync(`cd ${project.path} && git init && git add . && git commit -m "chore: project created"`)
  initGitOra.succeed(`initialized git repository successfully`)
}
