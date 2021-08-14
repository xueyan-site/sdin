#!/usr/bin/env node

import chalk from 'chalk'
import { padEnd } from 'lodash'
import { Command } from 'commander'
import { prompt } from 'enquirer'
import validator from 'validator'
import { cwdPath, cmdPath } from 'utl/path'
import { printExitError, printInfo } from 'utl/print'
import { readGitConfigSync, readJsonSync } from 'utl/read'
import Package, { PACKAGE_TYPE } from 'pro/package'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'
import { PackageCreator } from 'scr/package'
import { ReactCSRCreator } from 'scr/react-csr'
import type Creator from 'exe/creator'

process.env.XTCMD = 'create'
process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo(`welcome to use ${chalk.blue('xueyan-typescript-cli')}`)
printInfo('project creation process is ready')
console.log()
const program = new Command()

program
  .description('create project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  /**
   * 确认类型
   */
  const templateMeta = readJsonSync(cmdPath('tmp/meta.json'))
  const projects: any[] = templateMeta.projects || []
  const type = (await prompt<{ type: string }>([
    {
      type: 'select',
      name: 'type',
      message: 'what kind of project do you want to create',
      required: true,
      choices: projects.map((item: any) => ({
        name: item.type,
        message: chalk.red(padEnd(item.type, 16)) + item.label
      }))
    }
  ])).type
  /**
   * 确认需要使用的模版
   */
  process.env.XTTYPE = type
  const project = projects.find(i => i.type === type)
  const templateList = project.templates
  let template: any = templateList.length === 1
    ? templateList[0].name
    : ''
  if (!template) {
    template = (await prompt<{ template: string }>([
      {
        type: 'select',
        name: 'template',
        message: 'which project template do you want to use',
        required: true,
        choices: templateList.map((item: any) => ({
          name: item.name,
          message: chalk.red(padEnd(item.name, 16)) + item.label
        }))
      }
    ])).template
  }
  /**
   * 设置其余值
   */
  const git = readGitConfigSync()
  const answers = await prompt<{
    name: string
    root: string
    author: string
    email: string
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'what is the name of your project',
      required: true,
      validate: str => /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str)
    },
    {
      type: 'input',
      name: 'root',
      message: 'where do you want the project to be generated',
      required: true,
      initial: (data: any) => {
        const answers = data.state.answers
        const packageName = answers.name || ''
        return cwdPath(path || '', packageName.replace('/', '_'))
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'please tell me the name of the author',
      required: true,
      initial: git.user.name
    },
    {
      type: 'input',
      name: 'email',
      message: 'please tell me the author\'s email',
      required: true,
      initial: git.user.email,
      validate: validator.isEmail
    }
  ])
  /**
   * 生成项目模版
   */
  console.log()
  process.env.XTPATH = answers.root
  const meta = {
    type,
    root: answers.root,
    package: {
      name: answers.name,
      version: '1.0.0',
      author: `${answers.author} <${answers.email}>`
    }
  }
  let creator: Creator<any> | undefined
  if (meta.type === PACKAGE_TYPE) {
    creator = new PackageCreator({
      project: new Package(meta),
      template
    })
  } else if (meta.type === REACT_CSR_TYPE) {
    creator = new ReactCSRCreator({
      project: new ReactCSR(meta),
      template
    })
  }
  if (creator) {
    await creator.open()
  } else {
    throw Error(`sorry, there are no items of type ${meta.type}`)
  }
}
