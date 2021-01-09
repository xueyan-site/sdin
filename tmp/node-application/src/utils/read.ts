import fse from 'fs-extra'
import { isPlainObject, isString } from 'lodash'
import { withPath } from '../utils/path'
import { logErrorAndExit } from '../utils/print'
import { PackageInfo, AnyObject } from '../types'

/**
 * 获取json信息
 * 若传入的值是string，则与relationPath拼接成路径，读取该路径的文件，出错则报错并退出
 * 若传入的值是object，则原样返回
 * 若是其他值，则返回undefined
 * @param {Any} value 指定传入的值
 * @param {String} relationPath 指定文件的参考目录 @default ''
 */
export function readJSONSyncByValue(value: any, relationPath: string = ''): AnyObject {
  try {
    if (isPlainObject(value)) {
      return value
    } else if (isString(value)) {
      const jsonPath = withPath(relationPath, value)
      if (!fse.existsSync(jsonPath)) {
        throw Error(`"${jsonPath}" does not exist`)
      }
      const jsonInfo = fse.readJSONSync(jsonPath)
      if (!isPlainObject(jsonInfo)) {
        throw Error(`Failed to read "${jsonPath}", please check whether the file content format is correct`)
      }
      return jsonInfo
    } else {
      return {}
    }
  } catch (err) {
    return logErrorAndExit(err)
  }
}

/**
 * 根据文件夹目录，获取包的信息
 * @param {String} dirPath 指定文件夹目录
 */
export function readPackageInfoSyncByPath(projectPath: string): PackageInfo {
  try {
    const packageInfo = readJSONSyncByValue('package.json', projectPath)
    const author = packageInfo.author
    if (typeof author === 'object') {
      packageInfo.author = author.name || ''
      if (author.email) {
        packageInfo.author += ' <' + author.email + '>'
      }
    }
    if (!packageInfo.name || !packageInfo.version || !packageInfo.author) {
      throw Error('package.json must contain "name", "version", "author" fields')
    }
    return packageInfo as PackageInfo
  } catch (err) {
    return logErrorAndExit(err)
  }
}
