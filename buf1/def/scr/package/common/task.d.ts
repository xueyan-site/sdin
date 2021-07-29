import { FileFunction as FilterFunc } from 'gulp-filter';
import Package from 'pro/package';
/**
 * 编译项目（CLI运行的总实现）
 * @returns 耗时（ms）
 */
export declare function compile(project: Package, filter?: FilterFunc): Promise<number>;
/**
 * 处理素材文件（非脚本文件）
 */
export declare function handleAssets(project: Package, filter?: FilterFunc): Promise<void> | undefined;
/**
 * 处理定义文件
 */
export declare function handleDefine(project: Package, filter?: FilterFunc): Promise<void> | undefined;
/**
 * 构建类型文件
 */
export declare function handleTypes(project: Package): Promise<void> | undefined;
/**
 * 处理脚本文件
 * @param target 构建的目标类型
 */
export declare function handleScript(project: Package, target: 'web' | 'node', filter?: FilterFunc): Promise<void> | undefined;
