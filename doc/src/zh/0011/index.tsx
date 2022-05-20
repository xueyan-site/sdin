import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
配置文件路径：\`project/src/<xxx page>/page.js\`

> 此处仅列出 react-csr 项目页面独有的配置，更多配置参数请见 [应用项目的页面配置信息](${XT_PATH}?doc=0009)。

## skeleton

\`undefined | (page: ReactCSRPage) => string\`

HTML骨架图渲染器。\`xt\` 会将它的结果注入 HTML 的 body 中，作为页面的初始内容展示。

> 可以用它结合 puppeteer 和骨架屏组件，在打包时，做页面的预渲染工作。

ReactCSRPage 是 \`xt\` 用本配置文件生成的页面对象，其中包含内容太多，不便一一罗列。建议你打印后查看，或者直接查看[源码](https://github.com/xueyan-site/xueyan-typescript-cli/blob/main/src/pro/react-csr-page.ts)。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
