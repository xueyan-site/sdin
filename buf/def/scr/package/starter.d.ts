import Package from 'pro/package';
import Starter, { StarterProps } from 'exe/starter';
/**
 * 包构建器实例化参数
 */
export interface PackageStarterProps extends StarterProps<Package> {
}
/**
 * 包构建器
 */
export default class PackageStarter extends Starter<Package> {
    constructor(props: PackageStarterProps);
    main(): Promise<void>;
}
