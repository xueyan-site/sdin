import Creator, { CreatorProps } from 'exe/creator';
import ReactCSR from 'pro/react-csr';
/**
 * react应用创建器实例化参数
 */
export interface ReactCSRCreatorProps extends CreatorProps<ReactCSR> {
}
/**
 * react应用创建器
 */
export default class ReactCSRCreator extends Creator<ReactCSR> {
    constructor(props: ReactCSRCreatorProps);
    main(): Promise<void>;
}
