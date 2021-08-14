import type ReactCSR from 'pro/react-csr'

/**
 * 预校验
 */
export async function precheck(project: ReactCSR): Promise<string> {
  // react-refresh需要优于react加载，才会生效，所以需要确保dependence中有react包
  if (['react', 'react-dom'].some(i => !project.getDepVersion(i))) {
    return 'please install react、react-dom dependence'
  }
  // xueyan-react作为react-csr项目的基础包，必须安装，否则编译会报错
  if (!project.getDepVersion('xueyan-react')) {
    return 'please install xueyan-react dependence'
  }
  const illegalFileList = await project.getIrregularFileList(project.src, 'src')
  if (illegalFileList.length > 0) {
    return ['Please change the following files to kebab-case']
      .concat(illegalFileList)
      .join('\n   - ')
  }
  return ''
}
