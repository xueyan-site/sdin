import { Page } from './page'
import type { ReactCSR } from './react-csr'
import type { PageConfig, PageProps } from './page'

/**
 * react-csr页面配置
 */
export interface ReactCSRPageConfig extends PageConfig {
  /**
   * HTML骨架图渲染器
   */
  skeleton?: (page: ReactCSRPage) => string
}

/**
 * react-csr页面实例化参数
 */
export interface ReactCSRPageProps extends PageProps<ReactCSR> {}

/**
 * react-csr页面
 */
export class ReactCSRPage extends Page<ReactCSR, ReactCSRPageConfig> {
  /**
   * HTML骨架图渲染器
   */
  readonly skeleton: (page: ReactCSRPage) => string

  constructor(props: ReactCSRPageProps) {
    super(props, props.project.__pageConfig__)
    const config = this.config
    const __config__ = props.project.__pageConfig__
    // 设置HTML的骨架图
    this.skeleton = config.skeleton || __config__.skeleton || this.__skeleton__
  }

  /**
   * 骨架图兜底值
   */
  private __skeleton__(): string {
    return ''
  }
}
