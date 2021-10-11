import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## <%= name %>

\`<%= name %>\` 是一个命令行工具.  

\`\`\`shell
# <%= name %> create
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
