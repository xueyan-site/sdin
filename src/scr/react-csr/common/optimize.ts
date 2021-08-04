/**
 * 分割代码的设置
 * @param project 
 * @returns 
 */
export function getSplitChunks(): { cacheGroups: any } {
  return {
    cacheGroups: {
      // 打包业务中公共代码
      src02: getSplitSourceConfig(10, 2),
      src05: getSplitSourceConfig(11, 5),
      src12: getSplitSourceConfig(12, 12),
      src24: getSplitSourceConfig(13, 24),
      // 打包第三方库的文件
      mdl02: getSplitModuleConfig(20, 2),
      mdl05: getSplitModuleConfig(21, 5),
      mdl12: getSplitModuleConfig(22, 12),
      mdl24: getSplitModuleConfig(23, 24)
    }
  }
}

/**
 * 获取公共源代码分割配置
 * @param priority 优先级
 * @param minCount 最少被引用多少次
 */
function getSplitSourceConfig(priority: number, minCount: number) {
  return {
    name: 'src' + minCount,
    chunks: "initial",
    minSize: 1,
    priority: priority,
    minChunks: minCount
  }
}

/**
 * 获取外部模块分割配置
 * @param priority 优先级
 * @param minCount 最少被引用多少次
 */
function getSplitModuleConfig(priority: number, minCount: number) {
  return {
    test: /[\\/]node_modules[\\/]/,
    name: 'mdl' + minCount,
    chunks: "initial",
    priority: priority,
    minChunks: minCount
  }
}
