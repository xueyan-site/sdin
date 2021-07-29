import ReactCSR from 'pro/react-csr';
import { Compiler } from 'webpack';
/**
 * 创建webpack实例
 * @param project
 * @returns
 */
export declare function createWebpack(project: ReactCSR): Promise<Compiler>;
