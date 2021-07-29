import { WebpackPluginInstance } from 'webpack';
import ReactCSR from 'pro/react-csr';
import { AnyObject } from 'types';
/**
 * 获取入口配置信息
 * @param start 是否开发状态
 * @returns
 */
export declare function getPages(project: ReactCSR, dev: boolean): Promise<{
    entry: AnyObject<string | string[]>;
    plugins: WebpackPluginInstance[];
}>;
