#!/usr/bin/env node

import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import { Command } from 'commander'
import { CMD_PATH } from '../utils/path'
import { getPackageInfoSync } from '../utils/package'

const pkg = getPackageInfoSync(CMD_PATH)
const cmd = new Command()

// 检查更新
const noti = updateNotifier({ pkg })
console.log()
if (noti.update) {
  const { current, latest, type, name } = noti.update
  console.log(`you can update ${name} to new ${type} version`)
  console.log([
    `- version:  ${chalk.blue(current)} => ${chalk.green(latest)}`,
    `- npm:      npm i -g ${name}@latest`,
    `- yarn:     yarn global add ${name}@latest`
  ].join('\n'))
} else {
  console.log(`😊 ${pkg.name} ${pkg.version}`)
}
console.log()

// 命令行的帮助信息
const HELP_INFO = `
██╗  ██╗████████╗
╚██╗██╔╝╚══██╔══╝
 ╚███╔╝    ██║   
 ██╔██╗    ██║   
██╔╝ ██╗   ██║   
╚═╝  ╚═╝   ╚═╝   

name:        ${pkg.name}
version:     ${pkg.version}
license:     ${pkg.license || 'private'}
author:      ${pkg.author}
description: ${pkg.description || '--'}
`

cmd
  .command('create', 'create project', {
    executableFile: './create'
  })
  .command('dev', 'develop project', {
    executableFile: './develop'
  })
  .command('start', 'command <dev> alias', {
    executableFile: './develop'
  })
  .command('build', 'build project to production line', {
    executableFile: './build'
  })
  .command('serve', 'open project server', {
    executableFile: './serve'
  })
  .command('track', 'open tracking service', {
    executableFile: './track'
  })
  .name(Object.keys(pkg.bin)[0])
  .version(pkg.name + ' ' + pkg.version)
  .on('--help', () => console.log(HELP_INFO))
  .parse(process.argv)
