import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const code1 = `
\`\`\`shell
# <%= name %> create
\`\`\`
`

const code2 = `
\`\`\`shell
The node application path: <CWD>
\`\`\`
`

export default function UseOne() {
  return (
    <Fragment>
      <MarkdownSegment>{code1}</MarkdownSegment>
      <p>结果：</p>
      <MarkdownSegment>{code2}</MarkdownSegment>
    </Fragment>
  )
}
