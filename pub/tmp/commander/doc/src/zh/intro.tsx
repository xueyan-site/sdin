import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## <%= name %>

\`<%= name %>\` is a command line tool.  

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
