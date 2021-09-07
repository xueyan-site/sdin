import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const code1 = `
\`\`\`shell
# <%= name %> create
\`\`\`
`

const code2 = `
\`\`\`shell
new application path: <CWD>
\`\`\`
`

export default function Use() {
  return (
    <Fragment>
      <MarkdownSegment>{code1}</MarkdownSegment>
      <p>result: </p>
      <MarkdownSegment>{code2}</MarkdownSegment>
    </Fragment>
  )
}
