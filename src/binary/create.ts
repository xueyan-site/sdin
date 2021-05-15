#!/usr/bin/env node

import { Command } from 'commander'
import { prompt } from 'enquirer'
import validator from 'validator'
import { cwdPath, cmdPath } from 'utils/path'
import { logErrorAndExit } from 'utils/print'
import { readGitConfigSync, readJsonSync } from 'utils/read'
import Package, { PACKAGE_TYPE } from 'projects/package'
import ReactCSR, { REACT_CSR_TYPE } from 'projects/react-csr'
import { PackageCreater } from 'scripts/package'
import { ReactCSRCreater } from 'scripts/react-csr'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

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
  const { projects } = readJsonSync(cmdPath('tmp/meta.json'))
  const { project } = await prompt<{ project: any }>([
    {
      type: 'select',
      name: 'project',
      initial: program.type,
      message: 'project type',
      required: true,
      choices: projects.map((item: any) => ({
        name: item.type,
        value: item,
        message: item.label
      }))
    }
  ])
  /**
   * 确认需要使用的模版
   */
  const type = project.type
  const templateList = project.templates
  let template: any = templateList.length === 1
    ? templateList[0].name
    : ''
  if (!template) {
    template = (await prompt<{ template: string }>([
      {
        type: 'select',
        name: 'type',
        initial: program.type,
        message: 'project type',
        required: true,
        choices: templateList.map((item: any) => ({
          name: item.name,
          message: item.label
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
    path: string
    author: string
    email: string
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'package name',
      required: true,
      validate: str => /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str)
    },
    {
      type: 'input',
      name: 'path',
      message: 'project path',
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
      message: 'package author name',
      required: true,
      initial: git.user.name
    },
    {
      type: 'input',
      name: 'email',
      message: 'package author email',
      required: true,
      initial: git.user.email,
      validate: validator.isEmail
    }
  ])
  /**
   * 生成项目模版
   */
  const meta = {
    type,
    path: answers.path,
    package: {
      name: answers.name,
      version: '1.0.0',
      author: `${answers.author} <${answers.email}>`
    }
  }
  if (meta.type === PACKAGE_TYPE) {
    const creater = new PackageCreater({
      project: new Package(meta),
      template
    })
    await creater.open()
  } else if (meta.type === REACT_CSR_TYPE) {
    const creater = new ReactCSRCreater({
      project: new ReactCSR(meta),
      template
    })
    await creater.open()
  } else {
    throw new Error('please indicates the type of project in config file')
  }
}
