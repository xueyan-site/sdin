#!/usr/bin/env node

import { Command, ExecutableCommandOptions } from 'commander'
import { readPackageInfoSyncByPath } from '../utils/read'
import { logErrorAndExit } from '../utils/print'
import { CMD } from '../utils/path'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()
const packageInfo = readPackageInfoSyncByPath(CMD)

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

author:      ${packageInfo.author || 'unknown'}
version:     ${packageInfo.version || 'unknown'}
license:     ${packageInfo.license || 'private'}
description: ${packageInfo.description || 'not yet'}
`

SUB_CMD_LIST.forEach(cmd => {
  program.command(cmd.command, cmd.description, cmd.options)
})

program
  .version(packageInfo.name + ' ' + packageInfo.version)
  .on('--help', () => console.log(HELP_INFO))
  .parse(process.argv)
