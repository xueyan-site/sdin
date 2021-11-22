import React, { useState, Fragment } from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import Playground from 'xueyan-react-playground'
import { Switch } from '<%= name %>'

const MARK1 = `
## <%= name %>

\`<%= name %>\` is a react component.  

## Usage
`

const code1 = `
import React, { useState } from 'react'
import Switch from '<%= name %>'

export default function Example() {
  const [state, setState] = useState<boolean>(false)
  return (
    <Fragment>
      <span>switch: </span>
      <Switch value={state} onChange={setState} />
    </Fragment>
  )
}
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Playground scope={{ React, useState, Fragment, Switch }}>
        {code1}
      </Playground>
    </Article>
  )
}
