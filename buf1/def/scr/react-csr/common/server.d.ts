import { Context, Next } from 'koa';
import { Options } from 'koa-static';
import ReactCSR from 'pro/react-csr';
import ReactCSRPage from 'pro/react-csr-page';
export interface WebStaticOptions extends Omit<Options, 'maxage'> {
    dist: string;
    prefix?: string;
}
/**
 * 网站静态资源
 */
export declare function webStatic(options: WebStaticOptions): import("koa").Middleware<{}, import("koa").DefaultContext, any>;
interface WebErrorOptions {
    project: ReactCSR;
    reader?: (ctx: Context, page: ReactCSRPage, error: any) => Promise<any>;
}
/**
 * 网站错误兜底
 */
export declare function webError(options: WebErrorOptions): (ctx: Context, next: Next) => Promise<void>;
export {};
