import ora from 'ora'
import { execSync } from 'child_process'
import ReactPackageProject from '../../projects/react-package-project'
import { copyProjectTemplate } from '../../utils/write'
import { withPath } from '../../utils/path'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: ReactPackageProject) {
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
   * 下载 doc node_modules
   */
  const downloadDocOra = ora('downloading doc node modules').start()
  execSync(`cd ${withPath(project.path, 'doc')} && yarn`)
  downloadDocOra.succeed(`downloaded doc node modules successfully`)
  /**
   * 初始化git
   */
  const initGitOra = ora('initializing git repository').start()
  execSync(`cd ${project.path} && git init && git add . && git commit -m "chore: project created"`)
  initGitOra.succeed(`initialized git repository successfully`)
}
