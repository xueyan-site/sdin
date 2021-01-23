import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'
import { add } from '<%= package.name %>'

const code1 = `
\`\`\`ts
import { add } from '<%= package.name %>'

add(1, 1)
\`\`\`
`

export default function UseOne() {
  return (
    <Fragment>
      <MarkdownSegment>{code1}</MarkdownSegment>
      <p>result: </p>
      <p>{add(1,1)}</p>
    </Fragment>
  )
}
