import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
接下来，我们学习一下 \`XT\` 开发 react 应用程序的流程。

> 本文需要结合文章 “基础教程 / 开发工具包” 一起阅读。

## 创建新项目

运行以下命令来创建一个新项目：

\`\`\`shell
$ xt create
\`\`\`

\`XT\` 会让你选择项目类型。此时，请选择 \`react-csr\`。

其它与 “基础教程 / 开发工具包 > 创建新项目” 一致。  

## 启动项目并开始开发

打开刚才创建的项目，在命令行中，进入项目根目录，输入：

\`\`\`shell
$ xt start
\`\`\`

其它与 “基础教程 / 开发工具包 > 启动项目并开始开发” 一致。  

## 提交项目代码

与 “基础教程 / 开发工具包 > 提交项目代码” 一致。  

## 构建项目产物

输入构建命令。  

\`\`\`shell
$ xt build
\`\`\`

完成之后，在项目根目录下，会生成dist文件夹，这就是项目产物。

最后，运行项目产物。

\`\`\`shell
$ xt serve
\`\`\`

至此，一个全新的 React 应用程序开发完成了。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
