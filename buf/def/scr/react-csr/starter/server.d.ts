import Koa from 'koa';
import { Compiler } from 'webpack';
import ReactCSR from 'pro/react-csr';
/**
 * 创建服务器
 */
export declare function createServer(project: ReactCSR, compiler: Compiler): Promise<Koa<Koa.DefaultState, Koa.DefaultContext>>;
