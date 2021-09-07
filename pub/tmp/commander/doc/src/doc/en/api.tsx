import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const mark1 = `
## path

\`undefined | string\`

Specify the path as the application root directory that you will create next.

If you not input path, default is the current working directory.
`

export default function Api() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
    </Fragment>
  )
}
