import chalk from 'chalk'
import { isError, isString } from 'lodash'

/**
 * 获取标记
 */
const startTime = Date.now()
const getLabel = (flag: string) => {
  return `${startTime} ${Date.now()} ${flag}: `
}

/**
 * 打印错误信息
 * @param {String} msg 信息
 */
export const logError = (msg: string | Error, callback?: () => void) => {
  const txt = isError(msg) ? msg.message : isString(msg) ? msg : ''
  if (txt) {
    console.log(getLabel('err'), chalk.red(txt))
    if (isError(msg) && msg.stack) {
      console.error(msg.stack)
    }
    if (callback) {
      callback()
    }
  }
}

/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export const logErrorAndExit = (msg: string | Error, code?: number): any => {
  logError(msg, () => {
    process.exit(code)
  })
}

/**
 * 打印普通信息
 * @param {String} msg 信息
 */
export const logInfo = (msg: string, callback?: () => void) => {
  const txt = isString(msg) ? msg : ''
  if (txt) {
    console.log(getLabel('inf'), chalk.gray(msg))
    if (callback) {
      callback()
    }
  }
}

/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export const logInfoAndExit = (msg: string, code?: number): any => {
  logInfo(msg, () => {
    process.exit(code)
  })
}

/**
 * 打印警告信息
 * @param {String} msg 信息
 */
export const logWarning = (msg: string) => {
  const txt = isString(msg) ? msg : ''
  if (txt) {
    console.log(getLabel('war'), chalk.yellow(msg))
  }
}

/**
 * 打印成功信息
 * @param {String} msg 信息
 */
export const logSuccess = (msg: string) => {
  const txt = isString(msg) ? msg : ''
  if (txt) {
    console.log(getLabel('suc'), chalk.green(msg))
  }
}
