import ProjectCreator, { ProjectCreatorProps } from 'base/project-creator'
import ReactApplication, { REACT_APPLICATION_TYPE } from 'projects/react-application'

/**
 * react应用的模版项
 */
export const REACT_APPLICATION_TEMPLATE_OPTIONS: {
  label: string,
  value: string
}[] = [
  {
    label: REACT_APPLICATION_TYPE + ' default template',
    value: REACT_APPLICATION_TYPE
  }
]

/**
 * react应用创建器实例化参数
 */
export interface ReactApplicationCreaterProps extends ProjectCreatorProps<ReactApplication> {}

/**
 * react应用创建器
 */
export default class ReactApplicationCreator extends ProjectCreator<ReactApplication> {
  constructor(props: ReactApplicationCreaterProps) {
    super(props, REACT_APPLICATION_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadProjectModules()
    this.downloadDocumentModules()
    this.initializeGitRepository()
  }
}
