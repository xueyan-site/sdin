import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## xueyan-typescript-cli

\`\`\`shell
# xt create
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
