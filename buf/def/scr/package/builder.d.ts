import Package from 'pro/package';
import Builder, { BuilderProps } from 'exe/builder';
/**
 * 包构建器实例化参数
 */
export interface PackageBuilderProps extends BuilderProps<Package> {
}
/**
 * 包构建器
 */
export default class PackageBuilder extends Builder<Package> {
    constructor(props: PackageBuilderProps);
    main(): Promise<void>;
}
