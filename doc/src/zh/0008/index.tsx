import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
配置文件：\`project.js\`

> 此处仅列出 package 项目独有的配置，更多配置参数请见 [应用项目配置](${XT_ASSETS_PATH}?doc=0007)。

## buildWeb

\`boolean = true\`

生成 web 端使用的脚本。

## buildNode

\`boolean = true\`

生成 node端使用的脚本。

## 构建出定义文件

\`boolean = true\`

生成 Typescript 定义文件。

## useReact

\`boolean = false\`

添加 @babel/preset-react 插件。（即支持转换 React JSX 写法）

## useUglify

\`boolean = false\`

使用 gulp-uglify 混淆代码。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
