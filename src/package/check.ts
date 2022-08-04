import { resolve } from 'path'
import { getDepVersion } from '../utils/package'
import { getIrregularFileNames } from '../project/check'
import { printExit } from '../utils/console'
import type { PackageInfo } from '../utils/package'

/**
 * 构建前的预校验
 */
export async function precheckPackage(
  root: string,      // 项目地址
  pkg: PackageInfo   // 项目的package信息
): Promise<void> {
  if (!getDepVersion(pkg, '@babel/runtime')) {
    printExit('please install @babel/runtime dependence')
  }
  const list = await getIrregularFileNames(resolve(root, 'src'), 'src')
  if (list.length > 0) {
    printExit(
      ['please change the following files to kebab-case']
        .concat(list)
        .join('\n   - ')
    )
  }
}
