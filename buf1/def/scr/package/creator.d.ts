import Creator, { CreatorProps } from 'exe/creator';
import Package from 'pro/package';
/**
 * node包创建器实例化参数
 */
export interface PackageCreatorProps extends CreatorProps<Package> {
}
/**
 * node包创建器
 */
export default class PackageCreator extends Creator<Package> {
    constructor(props: PackageCreatorProps);
    main(): Promise<void>;
}
