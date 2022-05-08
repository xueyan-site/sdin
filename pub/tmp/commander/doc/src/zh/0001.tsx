import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## <%= name %>

TODO

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
