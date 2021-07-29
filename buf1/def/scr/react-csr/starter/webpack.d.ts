import { Compiler } from 'webpack';
import ReactCSR from 'pro/react-csr';
/**
 * 获取webpack配置
 * @param project
 * @returns
 */
export declare function createWebpack(project: ReactCSR): Promise<Compiler>;
