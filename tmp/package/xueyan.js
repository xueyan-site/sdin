module.exports = {
  /**
   * 项目类型
   * type: 'package'
   */
  type: 'package',

  /**
   * 模块的alias
   * alias?: { [index: string]: string }
   * default: undefined
   * 
   * 为了保证ts能够识别，还需要在tsconfig中配置一番
   * tsconfig.json > compilerOptions > paths: {
   *   "types": ["src/types.ts"]
   * }
   */
  alias: {
    types: 'src/types'
  },

  /**
   * 构建出web端使用的脚本
   * buildWeb: boolean
   * default: true
   * 
   * 设置成false后，请将package.json中的module字段删除
   * package.json > module (delete)
   */
  // buildWeb: true,

  /**
   * 构建出node端使用的脚本
   * buildNode: boolean
   * default: true
   * 
   * 设置成false后，请将package.json中的main字段删除
   * package.json > main (delete)
   */
  // buildNode: true,
  
  /**
   * 构建出定义文件
   * buildTypes: boolean
   * default: true
   * 
   * 设置成false后，请将package.json中的types字段删除
   * package.json > types (delete)
   */
  // buildTypes: true,
  
  /**
   * 使用react
   * 若不启用，则不会转换关于JSX的代码
   * useReact: boolean
   * default: false
   */
  // useReact: true,
  
  /**
   * 混淆代码
   * 启用以后，代码会被压缩至一行，且变量名会发生改变
   * useUglify: boolean
   * default: false
   */
  // useUglify = false
}