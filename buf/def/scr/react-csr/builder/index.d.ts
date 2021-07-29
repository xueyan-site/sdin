import ReactCSR from 'pro/react-csr';
import Builder, { BuilderProps } from 'exe/builder';
/**
 * react应用构建器实例化参数
 */
export interface ReactCSRBuilderProps extends BuilderProps<ReactCSR> {
}
/**
 * react应用构建器
 */
export default class ReactCSRBuilder extends Builder<ReactCSR> {
    constructor(props: ReactCSRBuilderProps);
    main(): Promise<void>;
    /**
     * 处理脚本文件
     */
    protected scriptTask(): Promise<void>;
}
