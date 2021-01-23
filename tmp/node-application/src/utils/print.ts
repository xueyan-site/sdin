import chalk from 'chalk'
import { isError, isString } from 'lodash'

/**
 * 获取相对于开始的时间  
 * get the time relative to start  
 */
const startTime = Date.now()
const getTimeout = (flag: string) => {
  let delay = Date.now() - startTime
  const h = Math.floor(delay / 3600000)
  delay = delay % 3600000
  const m = Math.floor(delay / 60000)
  delay =  delay % 60000
  const s = Math.floor(delay / 1000)
  const ms = delay % 1000
  return '['
    + ('00' + h).slice(-2)
    + ':'
    + ('00' + m).slice(-2)
    + ':'
    + ('00' + s).slice(-2)
    + '.'
    + ('000' + ms).slice(-3)
    + ' '
    + flag
    + ']'
}

/**
 * 打印错误信息  
 * print error message
 * @param {String} msg 信息 message
 */
export const logError = (msg: string | Error, callback?: () => void) => {
  const txt = isError(msg) ? msg.message : isString(msg) ? msg : ''
  if (txt) {
    console.log(getTimeout('err'), chalk.red(txt))
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
 * print error message and exit  
 * @param {String} msg 信息 message
 */
export const logErrorAndExit = (msg: string | Error, code?: number): any => {
  logError(msg, () => {
    process.exit(code)
  })
}

/**
 * 打印普通信息  
 * print normal message  
 * @param {String} msg 信息 message
 */
export const logInfo = (msg: string, callback?: () => void) => {
  const txt = isString(msg) ? msg : ''
  if (txt) {
    console.log(getTimeout('inf'), chalk.gray(msg))
    if (callback) {
      callback()
    }
  }
}

/**
 * 打印错误信息并退出  
 * print error message and exit  
 * @param {String} msg 信息 message
 */
export const logInfoAndExit = (msg: string, code?: number): any => {
  logInfo(msg, () => {
    process.exit(code)
  })
}

/**
 * 打印警告信息  
 * print warning message  
 * @param {String} msg 信息 message
 */
export const logWarning = (msg: string) => {
  const txt = isString(msg) ? msg : ''
  if (txt) {
    console.log(getTimeout('war'), chalk.yellow(msg))
  }
}

/**
 * 打印成功信息  
 * print success message  
 * @param {String} msg 信息 message
 */
export const logSuccess = (msg: string) => {
  const txt = isString(msg) ? msg : ''
  if (txt) {
    console.log(getTimeout('suc'), chalk.green(msg))
  }
}
