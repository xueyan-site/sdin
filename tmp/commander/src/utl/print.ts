import dayjs from 'dayjs'
import chalk, { Chalk } from 'chalk'
import { isError } from 'lodash'

const TIME_FORMAT = 'YY/MM/DD HH:mm ss.SSS'

/**
 * 获取标签
 */
function getLabel(icon: string, color: Chalk, msg: string) {
  const curr = dayjs()
  return `${icon} ${color(curr.format(TIME_FORMAT))} ${msg}`
}

/**
 * 打印错误信息
 * @param {String} msg 信息
 */
export const printError = (msg: string | Error, callback?: () => void) => {
  if (msg) {
    if (isError(msg) && msg.message) {
      console.log(getLabel('💥', chalk.red, msg.message))
      console.error(msg.stack)
    } else {
      console.log(getLabel('🐛', chalk.red, msg as any))
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
export const printExitError = (msg: string | Error, code?: number) => {
  printError(msg, () => process.exit(code))
}

/**
 * 打印普通信息
 * @param {String} msg 信息
 */
export const printInfo = (msg: string, callback?: () => void) => {
  if (msg) {
    console.log(getLabel('🍀', chalk.cyan, msg))
    if (callback) {
      callback()
    }
  }
}

/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export const printExitInfo = (msg: string, code?: number) => {
  printInfo(msg, () => process.exit(code))
}

/**
 * 打印加载信息
 * @param {String} msg 信息
 */
export const printLoading = (msg: string) => {
  if (msg) {
    console.log(getLabel('🚀', chalk.green, msg))
  }
}

/**
 * 打印警告信息
 * @param {String} msg 信息
 */
export const printWarning = (msg: string) => {
  if (msg) {
    console.log(getLabel('🔔', chalk.yellow, msg))
  }
}

/**
 * 打印成功信息
 * @param {String} msg 信息
 */
export const printSuccess = (msg: string) => {
  if (msg) {
    console.log(getLabel('🍺', chalk.blue, msg))
  }
}
