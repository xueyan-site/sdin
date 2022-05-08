import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
本文展示 package 项目的配置文件参数。

> 此处仅列 package 项目特有配置，更多配置参数请见 “接口字典 / 项目配置”。

## buildWeb

\`boolean = true\`

> 默认值为 true

构建时，生成web端使用的脚本。

## buildNode

\`boolean = true\`

> 默认值为 true

构建时，node端使用的脚本。

## 构建出定义文件

\`boolean = true\`

> 默认值为 true

构建时，生成 Typescript 定义文件。

## useReact

\`boolean = false\`

> 默认值为 false

在构建时，添加 @babel/preset-react。（即支持转换 React JSX 写法）

## useUglify

\`boolean = false\`

> 默认值为 false

在构建时，使用 gulp-uglify 混淆代码。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
