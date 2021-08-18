#!/usr/bin/env node

import fse from 'fs-extra'
import chalk from 'chalk'
import { Command } from 'commander'
import { executeSync } from 'utl/exec'
import { cmdPath } from 'utl/path'
import { printExitError, printExitInfo, printInfo, printWarning } from 'utl/print'
import { deepCopy, getReplaceHandler } from 'utl/write'
import { prompt } from 'enquirer'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo(`welcome to use ${chalk.blue('xueyan-typescript-cli')}`)
const program = new Command()

program
  .description('start tracking services')
  .action(action)
  .parse(process.argv)

async function action() {
  // 检查docker是否存在，若不存在，则给出指引
  try {
    executeSync('docker -v', { stdio: 'ignore' })
  } catch (err) {
    printWarning('sorry, open tracking server failed, because you don\'t have docker installed')
    console.log()
    console.log('please get Docker from ' + chalk.blue('https://docs.docker.com/get-docker'))
    console.log('or you can try this shell cmd: ' + chalk.blue('curl -sSL https://get.docker.com/ | sh'))
    console.log('if you are Chinese, you can try: ' + chalk.blue('curl -sSL https://get.daocloud.io/docker | sh'))
    console.log()
    return process.exit()
  }
  console.log()
  // 检查是否有相关配置文件，若没有，则进行创建
  const esDockerComposePath = cmdPath('buf/est/docker-compose.yml')
  if (!fse.existsSync(esDockerComposePath)) {
    await deepCopy(
      cmdPath('com/est/docker-compose.yml'),
      esDockerComposePath,
      getReplaceHandler({
        esdPath: cmdPath('buf/esd')
      })
    )
  }
  // 把配置文件展示给用户，先给用户进行提示，让用户确认配置文件没有问题
  console.log('---------------------------------------------')
  console.log(chalk.blue(esDockerComposePath))
  console.log(fse.readFileSync(esDockerComposePath).toString('utf8'))
  console.log()
  const confirm = (await prompt<{ confirm: string }>([
    {
      type: 'select',
      name: 'confirm',
      message: 
        'next, we will launch elasticsearch and kibana with docker, whether to continue?'
        + '\n  '
        + chalk.yellow('note: docker will auto download and install them by docker-compose.yml'),
      required: true,
      choices: [
        {
          name: 'yes',
          message: 'yes, I\'m sure that docker-compose.yml is OK'
        },
        {
          name: 'no',
          message: 'no, I\'m not ready yet, or I want to edit docker-compose.yml'
        }
      ]
    }
  ])).confirm
  // 用户若是选择no，则展示编辑配置文件的方法
  if (confirm === 'no') {
    printInfo('you can use vim to edit this file:')
    return printExitInfo('vim ' +  esDockerComposePath)
  }
  // 接着查询是否已经启动，用docker启动应用（这儿使用静默启动，不显示消息）
  // 启动完成之后，就会开始启动查询界面服务器（这儿使用静默启动，不显示消息）
  executeSync(`docker-compose -f ${esDockerComposePath} up`)
}
