import ReactCSR from 'pro/react-csr';
import Server, { ServerProps } from 'exe/server';
/**
 * react应用创建器实例化参数
 */
export interface ReactCSRServerProps extends ServerProps<ReactCSR> {
}
/**
 * react应用创建器
 */
export default class ReactCSRServer extends Server<ReactCSR> {
    constructor(props: ReactCSRServerProps);
    main(): Promise<void>;
}
