import ora from 'ora'
import { execSync } from 'child_process'
import ReactApplicationProject from '../../projects/react-application-project'
import { copyProjectTemplate } from '../../utils/write'

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
  execSync(`cd ${project.path} && yarn`)
  downloadOra.succeed(`downloaded node modules successfully`)
  /**
   * 初始化git
   */
  const initGitOra = ora('initializing git repository').start()
  execSync(`cd ${project.path} && git init && git add . && git commit -m "chore: project created"`)
  initGitOra.succeed(`initialized git repository successfully`)
}
