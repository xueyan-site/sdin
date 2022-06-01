import type { ReactCSR } from 'pro/react-csr'

/**
 * 预校验
 */
export async function precheck(project: ReactCSR): Promise<string> {
  // react-refresh 需要优于 react 加载，才会生效，所以需要确保 dependence 中有 react 包
  if (['react', 'react-dom'].some(i => !project.getDepVersion(i))) {
    return 'please install react、react-dom dependence'
  }
  // xueyan-react 作为 react-csr 项目的基础包，必须安装，否则编译会报错
  if (!project.getDepVersion('xueyan-react')) {
    return 'please install xueyan-react dependence'
  }
  const illegalFileList = await project.getIrregularFileList(project.src, 'src')
  if (illegalFileList.length > 0) {
    return ['please change the following files to kebab-case']
      .concat(illegalFileList)
      .join('\n   - ')
  }
  return ''
}
