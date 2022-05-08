import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
本文展示 react-csr 项目的页面配置文件参数。

> 此处仅列 react-csr 页面特有配置，更多配置参数请见 “接口字典 / 页面配置”。

## skeleton

\`undefined | (page: ReactCSRPage) => string\`

HTML骨架图渲染器。\`XT\` 会将它的结果注入 HTML 的 body 中，作为页面的初始内容展示。

可以用它结合 puppeteer 和骨架屏组件，做页面打包阶段的预渲染。

ReactCSRPage，是 \`XT\` 用本配置文件生成的页面对象。其中包含了丰富的页面信息，内容太多，不便一一罗列。建议你打印后查看，或者直接查看源码：https://github.com/xueyan-site/xueyan-typescript-cli/blob/main/src/pro/react-csr-page.ts
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
