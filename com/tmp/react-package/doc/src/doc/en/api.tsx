import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const mark1 = `
## value

\`undefined | boolean\`

Switch state (on or off)

## onChange

\`undefined | (value: boolean) => void\`

Set switch state

## block

\`undefined | boolean\`

Let switch DOM become block element (true), or inline element (false)

## style

\`undefined | React.CSSProperties\`

Switch wrapper dom style

## className

\`undefined | string\`

Switch wrapper dom classname
`

export default function Api() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
    </Fragment>
  )
}
