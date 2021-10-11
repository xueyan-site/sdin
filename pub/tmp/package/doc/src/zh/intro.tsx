import React, { useState, Fragment } from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import Playground from 'xueyan-react-playground'
import { add } from '<%= name %>'

const MARK1 = `
## <%= name %>

\`<%= name %>\` 是一个可用于 Web 和 Node 端的 NPM 包.  
`

const code1 = `
import React, { useState, Fragment } from 'react'
import { add } from '<%= name %>'

export default function Example() {
  const [state, setState] = useState<number>(1)
  return (
    <Fragment>
      <div onClick={() => setState(add(1, state))}>
        点我 +1
      </div>
      <div onClick={() => setState(!state)}>
        结果 {state}
      </div>
    </Fragment>
  )
}
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Segment>## 示例</Segment>
      <Playground scope={{ React, useState, Fragment, add }}>{code1}</Playground>
    </Article>
  )
}
