import ReactCSR from 'pro/react-csr';
import { RuleSetRule } from 'webpack';
/**
 * 获取webpack的loader配置
 * @param project
 * @param dev
 * @returns
 */
export declare function getRules(project: ReactCSR, dev: boolean): RuleSetRule[];
