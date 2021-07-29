import ReactCSR from 'pro/react-csr';
import Builder, { BuilderProps } from 'exe/builder';
import { Stats } from 'webpack';
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
     * 编译脚本文件
     */
    protected compile(): Promise<Stats | undefined>;
}
