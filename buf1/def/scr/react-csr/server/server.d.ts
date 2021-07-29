import Koa from 'koa';
import ReactCSR from 'pro/react-csr';
/**
 * 创建服务器
 */
export declare function createServer(project: ReactCSR): Koa<Koa.DefaultState, Koa.DefaultContext>;
