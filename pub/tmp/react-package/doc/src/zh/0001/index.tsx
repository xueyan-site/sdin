import React, { useState } from 'react'
import { Article, Segment } from 'ark-markdown'
import { Playground } from 'ark-playground'
import { Switch } from '<%= name %>'

const MARK1 = `
TODO

## 用法
`

const code1 = `
import React, { useState } from 'react'
import { Switch } from '<%= name %>'

export default function Example() {
  const [state, setState] = useState<boolean>(false)
  return (
    <div style={{ display: 'flex', alignItem: 'center' }}>
      <div style={{ marginRight: '8px' }}>Switch</div>
      <Switch value={state} onChange={setState} />
    </div>
  )
}
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Playground scope={{ React, useState, Switch }}>
        {code1}
      </Playground>
    </Article>
  )
}
