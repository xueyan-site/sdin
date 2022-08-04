#!/usr/bin/env node

import updateNotifier from 'update-notifier'
import { blue, green } from 'chalk'
import { Command } from 'commander'
import { CMD_PATH } from '../utils/path'
import { getPackageInfoSync } from '../utils/package'

const pkg = getPackageInfoSync(CMD_PATH)
const cmd = new Command()

const noti = updateNotifier({ pkg })
console.log()
if (noti.update) {
  const { current, latest, type, name } = noti.update
  console.log(`you can update ${name} to new ${type} version`)
  console.log([
    `- version:  ${blue(current)} => ${green(latest)}`,
    `- npm:      npm i -g ${name}@latest`
  ].join('\n'))
} else {
  console.log(`${pkg.name} ${pkg.version}`)
}
console.log()

const HELP_INFO = `
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
  .name(Object.keys(pkg.bin)[0])
  .version(pkg.name + ' ' + pkg.version)
  .on('--help', () => console.log(HELP_INFO))
  .parse(process.argv)
