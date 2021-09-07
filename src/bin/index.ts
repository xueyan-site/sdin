#!/usr/bin/env node

import updateNotifier from 'update-notifier'
import { Command } from 'commander'
import { readPackageInfoSync } from 'utl/read'
import { printExitError, printInfo } from 'utl/print'
import { CMD } from 'utl/path'
import type { ExecutableCommandOptions } from 'commander'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, undefined, 1))

const program = new Command()
const packageInfo = readPackageInfoSync(CMD)

/**
 * 检查更新
 */
const notifier = updateNotifier({ pkg: packageInfo })
if (notifier.update) {
  const { current, latest, type, name } = notifier.update
  printInfo(`you can update ${name} to new ${type} version`)
  console.log([
    `  version: ${current} => ${latest}`,
    `  npm: npm i -g ${name}@latest`,
    `  yarn: yarn global add ${name}@latest`
  ].join('\n'))
}

/**
 * 子命令列表
 */
const SUB_CMD_LIST: {
  command: string
  description: string
  options: ExecutableCommandOptions & Required<Pick<ExecutableCommandOptions, 'executableFile'>>
}[] = [
  {
    command: 'create',
    description: 'create project',
    options: {
      executableFile: './create'
    }
  },
  {
    command: 'start',
    description: 'develop or debug project on browser',
    options: {
      executableFile: './start'
    }
  },
  {
    command: 'build',
    description: 'build project to production line',
    options: {
      executableFile: './build'
    }
  },
  {
    command: 'serve',
    description: 'open project server',
    options: {
      executableFile: './serve'
    }
  },
  {
    command: 'track',
    description: 'start tracking services',
    options: {
      executableFile: './track'
    }
  }
]

/**
 * 帮助信息
 */
const HELP_INFO = `
██╗  ██╗████████╗
╚██╗██╔╝╚══██╔══╝
 ╚███╔╝    ██║   
 ██╔██╗    ██║   
██╔╝ ██╗   ██║   
╚═╝  ╚═╝   ╚═╝   
                 
name:        ${packageInfo.name}
author:      ${packageInfo.author}
version:     ${packageInfo.version}
license:     ${packageInfo.license || 'private'}
description: ${packageInfo.description || 'not yet'}
`

SUB_CMD_LIST.forEach(cmd => {
  program.command(cmd.command, cmd.description, cmd.options)
})

program
  .name(Object.keys(packageInfo.bin)[0])
  .version(packageInfo.name + ' ' + packageInfo.version)
  .on('--help', () => console.log(HELP_INFO))
  .parse(process.argv)
