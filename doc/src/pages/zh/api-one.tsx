import React, { Fragment } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'

const mark1 = `
## path

\`undefined | string\`

指定路径作为你接下来要创建的应用程序的根目录。

如果你没有指定，则默认是当前工作目录。
`

export default function ApiOne() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
    </Fragment>
  )
}
