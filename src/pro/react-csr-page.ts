import ReactCSR from './react-csr'
import Page, { PageConfig, PageProps, PAGE_CONFIG } from './page'

/**
 * react-csr页面配置
 */
export interface ReactCSRPageConfig extends PageConfig {
  /**
   * 设置未渲染前的骨架
   */
  skeleton: (page: ReactCSRPage) => string
}

/**
 * react-csr页面实例化参数
 */
export interface ReactCSRPageProps extends PageProps<ReactCSR> {}

/**
 * react-csr页面配置信息默认值
 */
export const REACT_CSR_PAGE_CONFIG: ReactCSRPageConfig = {
  ...PAGE_CONFIG,
  skeleton: () => ''
}

/**
 * react-csr页面
 */
export default class ReactCSRPage extends Page<ReactCSR, ReactCSRPageConfig> {
  constructor(props: ReactCSRPageProps) {
    super(props, props.project.config.page)
    const config = this.config
    const __config__ = this.__config__
    config.skeleton = __config__.skeleton || config.skeleton
  }
}
