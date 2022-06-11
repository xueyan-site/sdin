import validator from 'validator'
import { execSync } from 'child_process'
import { existsSync } from 'fs-extra'
import { set } from 'lodash'
import { resolve } from 'path'
import { printExit } from './console'

interface GitInfo extends Record<string, any> {
  /** 用户名称 */
  userName: string
  /** 用户邮箱 */
  userEmail: string
}

/**
 * 获取git全局配置信息
 */
export function getGitGlobalConfigSync(): GitInfo {
  const cfgstr = execSync('git config --global --list').toString()
  const cfg: Record<string, any> = {}
  cfgstr.split('\n').forEach(line => {
    if (line) {
      const flagIndex = line.indexOf('=')
      if (flagIndex > 0) {
        set(cfg, line.slice(0, flagIndex), line.slice(flagIndex + 1))
      }
    }
  })
  if (!cfg.user || !cfg.user.name || !cfg.user.email) {
    printExit('please config git global user name and email')
  } else {
    cfg.userName = cfg.user.name
    cfg.userEmail = cfg.user.email
  }
  if (!validator.isEmail(cfg.userEmail)) {
    printExit('git global user email config format error')
  }
  return cfg as GitInfo
}

/**
 * 创建git仓库
 */
export function createGitRepository(path: string) {
  if (existsSync(resolve(path, '.git'))) {
    return
  }
  execSync(`cd ${path} && git init && git add . && git commit -m "chore: project is created"`, {
    stdio: 'inherit'
  })
  console.log()
}