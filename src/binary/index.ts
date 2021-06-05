#!/usr/bin/env node

import updateNotifier from 'update-notifier'
import { Command, ExecutableCommandOptions } from 'commander'
import { readPackageInfoSync } from 'utils/read'
import { printExitError, printInfo } from 'utils/print'
import { CMD } from 'utils/path'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo('welcome to use xueyan-typescript-cli')
const program = new Command()
const packageInfo = readPackageInfoSync(CMD)

/**
 * update check
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
  }
]

/**
 * you can see this site to create Character Painting
 * <http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow&t=xy-ts>
 */
const HELP_INFO = `
██╗  ██╗██╗   ██╗  ████████╗███████╗
╚██╗██╔╝╚██╗ ██╔╝  ╚══██╔══╝██╔════╝
 ╚███╔╝  ╚████╔╝█████╗██║   ███████╗
 ██╔██╗   ╚██╔╝ ╚════╝██║   ╚════██║
██╔╝ ██╗   ██║        ██║   ███████║
╚═╝  ╚═╝   ╚═╝        ╚═╝   ╚══════╝

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
