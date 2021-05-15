/**
 * 代指一切对象  
 * means any object  
 */
export interface AnyObject {
  [prop: string]: any
}

/**
 * 应用的配置
 * application config
 */
export interface AppConfig {
  /**
   * 当前项目的域名
   * current project domain
   */
  domain: string
}

/**
 * 全局信息
 * global information
 */
export interface GlobalInfo {
  /**
   * 当前用户名
   * current username
   */
  username: string
}
