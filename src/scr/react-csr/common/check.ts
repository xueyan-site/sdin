import ReactCSR from 'pro/react-csr'

/**
 * 预校验
 */
export async function precheck(project: ReactCSR): Promise<string> {
  // react-refresh需要优于react加载，才会生效
  // 所以需要确保dependence中有react包
  if (['react', 'react-dom'].some(i => !project.getDepVersion(i))) {
    return 'please install react、react-dom dependence'
  }
  const illegalFileList = await project.getIrregularFileList(project.src, 'src')
  if (illegalFileList.length > 0) {
    return ['Please change the following files to kebab-case']
      .concat(illegalFileList)
      .join('\n  - ')
  }
  return ''
}
