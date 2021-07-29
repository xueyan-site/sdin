import ReactCSR from 'pro/react-csr';
import Starter, { StarterProps } from 'exe/starter';
/**
 * react应用创建器实例化参数
 */
export interface ReactCSRStarterProps extends StarterProps<ReactCSR> {
}
/**
 * react应用创建器
 */
export default class ReactCSRStarter extends Starter<ReactCSR> {
    constructor(props: ReactCSRStarterProps);
    main(): Promise<void>;
}
