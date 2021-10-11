import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
欢迎您阅读 \`xueyan-typescript-cli\` 的使用文档。  

\`xueyan-typescript-cli\` 是为 Typescript 语言使用者制作的命令行工具。目前支持：  

- <div style="color:red">开发命令行工具</div>
- <div style="color:red">开发 \`Node\` 工具包</div>
- <div style="color:red">开发 \`Web\` 工具包</div>
- <div style="color:red">开发 \`React\` 组件</div>
- <div style="color:red">开发 \`React\` 客户端渲染程序</div>

为了方便，在本文后续内容中，\`xueyan-typescript-cli\` 简称为 \`XT\`。  

## 开发命令行工具

\`XT\` 就是命令行工具，它的构建工具是它自己。

作为 \`XT\` 的首个作品，在使用 \`XT\` 开发命令行工具时，它最具有参考意义。

它的具体实现，请见：<https://github.com/xueyan-site/xueyan-typescript-cli>。



初始模版中，包含了一份简单示例和一份空白文档。示例中除了version和help命令，还有一个create命令，使用它可以打

`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
