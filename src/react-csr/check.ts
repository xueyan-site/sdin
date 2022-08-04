import { resolve } from 'path'
import { getDepVersion } from '../utils/package'
import { getIrregularFileNames } from '../project/check'
import { printExit } from '../utils/console'
import type { PackageInfo } from '../utils/package'

/**
 * 构建前的预校验
 */
export async function precheckReactCSR(
  root: string,      // 项目地址
  pkg: PackageInfo   // 项目的package信息
): Promise<void> {
  // react-refresh 需要优于 react 加载，才会生效
  // 所以需要确保 dependence 中有 react 包
  if (['react', 'react-dom'].some(i => !getDepVersion(pkg, i))) {
    printExit('please install react、react-dom dependence')
  }
  // sdin-react 作为 react-csr 项目的基础包，必须安装，否则编译会报错
  if (!getDepVersion(pkg, 'sdin-react')) {
    printExit('please install sdin-react')
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
