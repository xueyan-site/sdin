import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
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
