/// <reference types="node" />
import { DeepReadNode } from './read';
import { AnyObject } from 'types';
/**
 * 深度遍历的节点信息
 */
export declare type DeepCopyNode = DeepReadNode;
/**
 * 深度遍历复制各个文件的信息
 * 文件名以__开头，是为了避开git、npm等，需要修正
 */
export declare function deepCopy(source: string, target: string, handler?: (node: DeepCopyNode, content: Buffer) => ((string | Buffer) | Promise<(string | Buffer)>), filter?: (node: DeepCopyNode) => (boolean | Promise<boolean>), rename?: (node: DeepCopyNode, target: string) => string): Promise<void>;
/**
 * 更换文本
 */
export declare function getReplaceHandler(variables: AnyObject): (_node: DeepCopyNode, content: Buffer) => string | Buffer;
