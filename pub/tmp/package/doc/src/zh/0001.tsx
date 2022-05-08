import React, { useState } from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import { Playground } from 'xueyan-react-playground'
import { add } from '<%= name %>'

const MARK1 = `
## <%= name %>

TODO

## 用法
`

const code1 = `
import React, { useState } from 'react'
import { add } from '<%= name %>'

export default function Example() {
  const [state, setState] = useState<number>(1)
  return (
    <div style={{ display: 'flex', alignItem: 'center' }}>
      <div style={{ width: '60px' }}>Result</div>
      <div style={{ width: '30px' }}>{state}</div>
      <button 
        style={{ marginRight: '8px' }} 
        onClick={() => setState(add(1, state))}
      >add</button>
      <button onClick={() => setState(1)}>reset</button>
    </div>
  )
}
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Playground scope={{ React, useState, add }}>
        {code1}
      </Playground>
    </Article>
  )
}
