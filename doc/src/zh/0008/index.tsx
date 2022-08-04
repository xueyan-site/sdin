import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
配置文件：\`project.js\`

| 属性 | 名称 | 类型 | 说明 |
| - | - | - | - |
| type | 项目类型 | \`'package'\` | 请勿修改 |
| name | 项目名称 | \`? string\` | 中英文都可以，默认 package.json/name |
| alias | 文件（夹）路径的别名 | \`? Record<string, string>\` | |
| buildWeb | 生成 ESM 代码 | \`? boolean\` | 默认 true |
| buildNode | 生成 CJS 代码 | \`? boolean\` | 默认 true |
| buildTypes | 生成 TS 定义 | \`? boolean\` | 默认 true |
| useReact | 支持 JSX 代码 | \`? boolean\` | 添加 @babel/preset-react 插件 |
| useUglify | 混淆并压缩构建产物 | \`? boolean\` | 添加 gulp-uglify 插件 |

## alias

\`? Record<string, string>\`

配置文件（夹）路径的别名

示例如下，配置文件夹 \`src/foo\` 别名为 \`foo\` ：

\`\`\`js
module.exports = {
  alias: {
    foo: "src/foo"
  }
}
\`\`\`

配置别名之后，在 tsconfig.json 中添加一下 path。

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "foo/*": ["./src/foo/*"]
    }
  }
}
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
