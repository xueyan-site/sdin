#!/usr/bin/env node

import { ensureDir, existsSync, readFileSync } from 'fs-extra'
import { resolve } from 'path'
import { v4 as uuid } from 'uuid'
import { blue, yellow } from 'chalk'
import { prompt } from 'enquirer'
import { Command } from 'commander'
import { execSync } from 'child_process'
import { CMD_PATH } from '../utils/path'
import { printExit } from '../utils/console'
import { deepCopy, getReplaceHandler } from '../utils/write'

const cmd = new Command()

cmd
  .description('open tracking services')
  .action(action)
  .parse(process.argv)

async function action() {
  // 检查docker是否存在，若不存在，则给出指引
  try {
    execSync('docker -v', { stdio: 'ignore' })
  } catch (err) {
    console.warn('sorry, open tracking server failed, because you don\'t have docker installed')
    console.log()
    console.log('please get Docker from ' + blue('https://docs.docker.com/get-docker'))
    console.log('or you can try this shell cmd: ' + blue('curl -sSL https://get.docker.com/ | sh'))
    console.log('if you are Chinese, you can try: ' + blue('curl -sSL https://get.daocloud.io/docker | sh'))
    console.log()
    return process.exit()
  }
  // 检查是否有相关配置文件，若没有，则进行创建
  const esDockerComposePath = resolve(CMD_PATH, 'buf/est/docker-compose.yml')
  if (!existsSync(esDockerComposePath)) {
    const esdPath = resolve(CMD_PATH, 'buf/esd')
    await ensureDir(esdPath)
    await deepCopy(
      resolve(CMD_PATH, 'pub/est/docker-compose.yml'),
      esDockerComposePath,
      getReplaceHandler({
        esdPath: resolve(CMD_PATH, 'buf/esd'),
        password: uuid()
      })
    )
  }
  // 把配置文件展示给用户，先给用户进行提示，让用户确认配置文件没有问题
  console.log('next, we will launch elasticsearch and kibana with docker')
  console.log('docker will auto download and install them by docker-compose.yml')
  console.log()
  console.log(blue('docker-compose.yml path:'))
  console.log(esDockerComposePath)
  console.log(blue('docker-compose.yml content: '))
  console.log(readFileSync(esDockerComposePath).toString('utf8'))
  console.log()
  const confirm = (await prompt<{ confirm: string }>([
    {
      type: 'select',
      name: 'confirm',
      message: blue('please make sure that docker-compose.yml is no problem (👆above)'),
      required: true,
      choices: [
        {
          name: 'yes',
          message: 'yes, I\'m sure that docker-compose.yml is OK!'
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
    console.log('you can use vim to edit docker-compose.yml:')
    return printExit(yellow('vim ' +  esDockerComposePath))
  }
  // 启动docker
  execSync(`docker-compose -f ${esDockerComposePath} up`, { stdio: 'inherit' })
}
