import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const mark1 = `
## value

\`undefined | boolean\`

开关的状态

## onChange

\`undefined | (value: boolean) => void\`

更改开关的状态

## block

\`undefined | boolean\`

显示开关为块级元素（true），或者行内元素

## style

\`undefined | React.CSSProperties\`

开关的样式

## className

\`undefined | string\`

开关的类名
`

export default function Api() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
    </Fragment>
  )
}
