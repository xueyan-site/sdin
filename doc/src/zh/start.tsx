import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## 下载

\`\`\`bash
npm i xueyan-react-playground
\`\`\`

\`\`\`bash
yarn add xueyan-react-playground
\`\`\`

## 常规用法
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
