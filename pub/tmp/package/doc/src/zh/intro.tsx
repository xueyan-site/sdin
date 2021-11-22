import React, { useState, Fragment } from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import Playground from 'xueyan-react-playground'
import { add } from '<%= name %>'

const MARK1 = `
## <%= name %>

\`<%= name %>\` is a package on web and node platform.  

## Usage
`

const code1 = `
import React, { useState, Fragment } from 'react'
import { add } from '<%= name %>'

export default function Example() {
  const [state, setState] = useState<number>(1)
  return (
    <Fragment>
      result: {state}
      <br />
      <button onClick={() => setState(add(1, state))}>
        add
      </button>
      <button onClick={() => setState(1)}>
        reset
      </button>
    </Fragment>
  )
}
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Playground scope={{ React, useState, Fragment, add }}>
        {code1}
      </Playground>
    </Article>
  )
}
