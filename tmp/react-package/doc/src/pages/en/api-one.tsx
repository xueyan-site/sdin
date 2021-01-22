import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const mark1 = `
## value

\`undefined | boolean\`

switch state (on or off)

## onChange

\`undefined | (value: boolean) => void\`

set switch state

## block

\`undefined | boolean\`

let switch DOM become block element (true), or inline element (false)

## style

\`undefined | React.CSSProperties\`

switch wrapper dom style

## className

\`undefined | string\`

switch wrapper dom classname
`

export default function ApiOne() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
    </Fragment>
  )
}
