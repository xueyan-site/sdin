import ReactCSR from './react-csr';
import Page, { PageConfig, PageProps } from './page';
/**
 * react-csr页面配置
 */
export interface ReactCSRPageConfig extends PageConfig {
    /**
     * HTML骨架图渲染器
     */
    skeleton?: (page: ReactCSRPage) => string;
}
/**
 * react-csr页面实例化参数
 */
export interface ReactCSRPageProps extends PageProps<ReactCSR> {
}
/**
 * react-csr页面
 */
export default class ReactCSRPage extends Page<ReactCSR, ReactCSRPageConfig> {
    /**
     * HTML骨架图渲染器
     */
    readonly skeleton: (page: ReactCSRPage) => string;
    constructor(props: ReactCSRPageProps);
    /**
     * 骨架图兜底值
     */
    private __skeleton__;
}
