import ProjectCreator, { ProjectCreatorProps } from 'base/project-creator'
import ReactPackage, { REACT_PACKAGE_TYPE } from 'projects/react-package'

/**
 * react包的模版项
 */
export const REACT_PACKAGE_TEMPLATE_OPTIONS: {
  label: string,
  value: string
}[] = [
  {
    label: REACT_PACKAGE_TYPE + ' default template',
    value: REACT_PACKAGE_TYPE
  }
]

/**
 * react包创建器实例化参数
 */
export interface ReactPackageCreaterProps extends ProjectCreatorProps<ReactPackage> {}

/**
 * react包创建器
 */
export default class ReactPackageCreator extends ProjectCreator<ReactPackage> {
  constructor(props: ReactPackageCreaterProps) {
    super(props, REACT_PACKAGE_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadProjectModules()
    this.downloadDocumentModules()
    this.initializeGitRepository()
  }
}
