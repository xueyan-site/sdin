import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
本文展示项目配置文件参数。（页面配置文件是页面根目录下的 \`project.js\`）

## type

\`'package' | 'react-csr'\`

> 不可变

项目的类型标识。

## name

\`string = <package.json.name>\`

> 默认值为 package.json 的 name 字段

项目名称。（不限语言，不限符号）

## alias

\`undefined | { [key: string]: string }\`

文件（夹）路径的别名。

示例：

\`\`\`js
module.exports = {
  alias: {
    foo: "src/foo"
  }
}
\`\`\`

配置了别名之后，请记得在 tsconfig.json 中添加一下 path。

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
