import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const mark1 = `
## add

\`function add(a: number, b: number): number\`

Add variable a and b
`

export default function Api() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
    </Fragment>
  )
}
