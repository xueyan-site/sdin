import type Package from 'pro/package'

/**
 * 预校验
 */
export async function precheck(project: Package): Promise<string> {
  if (!project.getDepVersion('@babel/runtime')) {
    return 'please install @babel/runtime dependence'
  }
  const illegalFileList = await project.getIrregularFileList(project.src, 'src')
  if (illegalFileList.length > 0) {
    return ['Please change the following files to kebab-case']
      .concat(illegalFileList)
      .join('\n   - ')
  }
  return ''
}
