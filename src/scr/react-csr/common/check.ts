import ReactCSR from 'pro/react-csr'

/**
 * 预校验
 */
export async function precheck(project: ReactCSR): Promise<string> {
  const illegalFileList = await project.getIrregularFileList(project.src, 'src')
  if (illegalFileList.length > 0) {
    return ['Please change the following files to kebab-case']
      .concat(illegalFileList)
      .join('\n  - ')
  }
  return ''
}
