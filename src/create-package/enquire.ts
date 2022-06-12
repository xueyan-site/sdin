import { blue } from 'chalk'
import { resolve } from 'path'
import { padEnd } from 'lodash'
import { prompt } from 'enquirer'
import validator from 'validator'
import { CWD_PATH, CMD_PATH } from '../utils/path'
import { CreatePackageProps } from './create'
import { getGitGlobalConfigSync } from '../utils/git'

const TMP_DESC_LIST = [
  {
    name: 'react-package',
    desc: 'package dedicated to react environment (can be shared by node, web side)'
  },
  {
    name: 'package',
    desc: 'common components or modules (can be shared by node, web side)'
  },
  {
    name: 'commander',
    desc: 'command line tools (with check for updates and code compile-time obfuscation)'
  }
]

export async function enquirePackage(
  target?: string, // 预设的项目生成目录
  name?: string
): Promise<CreatePackageProps> {
  const git = getGitGlobalConfigSync()
  // 选择项目模版
  const tmp = (await prompt<{ template: string }>({
    type: 'select',
    name: 'template',
    message: 'which project template do you want to use',
    required: true,
    choices: TMP_DESC_LIST.map(item => ({
      name: item.name,
      message: blue(padEnd(item.name, 16)) + item.desc
    }))
  })).template
  // 设置其余选项
  const data = await prompt<{
    name: string
    target: string
    authorName: string
    authorEmail: string
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'what is the name of your project',
      required: true,
      validate: str => /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str),
      initial: name
    },
    {
      type: 'input',
      name: 'target',
      message: 'where do you want the project to be generated',
      required: true,
      initial: (data: any) => {
        const name = (data.state.answers.name || '').replace('/', '_')
        return target ? resolve(target, name) : resolve(CWD_PATH, name)
      }
    },
    {
      type: 'input',
      name: 'authorName',
      message: 'please tell me the name of author',
      required: true,
      initial: git.userName
    },
    {
      type: 'input',
      name: 'authorEmail',
      message: 'please tell me the email of author',
      required: true,
      initial: git.userEmail,
      validate: validator.isEmail
    }
  ])
  console.log()
  return {
    ...data,
    version: '1.0.0',
    author: `${data.authorName} <${data.authorEmail}>`,
    source: resolve(CMD_PATH, `pub/tmp/${tmp}`),
  }
}
