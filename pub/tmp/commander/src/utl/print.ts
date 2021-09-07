import dayjs from 'dayjs'
import chalk, { Chalk } from 'chalk'
import { isError } from 'lodash'

const TIME_FORMAT = 'YY/MM/DD HH:mm ss.SSS'

/**
 * get message prefix
 */
function getLabel(icon: string, color: Chalk, msg: string) {
  const curr = dayjs()
  return `${icon} ${color(curr.format(TIME_FORMAT))} ${msg}`
}

/**
 * print error message
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
 * print error message and exit process
 */
export const printExitError = (msg: string | Error, code?: number) => {
  printError(msg, () => process.exit(code))
}

/**
 * print information
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
 * print information and exit process
 */
export const printExitInfo = (msg: string, code?: number) => {
  printInfo(msg, () => process.exit(code))
}

/**
 * print loading message
 */
export const printLoading = (msg: string) => {
  if (msg) {
    console.log(getLabel('🚀', chalk.green, msg))
  }
}

/**
 * print warning message
 */
export const printWarning = (msg: string) => {
  if (msg) {
    console.log(getLabel('🔔', chalk.yellow, msg))
  }
}

/**
 * print success message
 */
export const printSuccess = (msg: string) => {
  if (msg) {
    console.log(getLabel('🍺', chalk.blue, msg))
  }
}
