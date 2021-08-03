import React, { Fragment, useState } from 'react'
import Playground from 'xueyan-react-playground'
import { add } from '<%= name %>'

const code = `
import React, { useState } from 'react'
import { add } from '<%= name %>'

export default function UseSwitch() {
  const [state, setState] = useState<number>(1)
  return (
    <React.Fragment>
      <div onClick={() => setState(add(1, state))}>
        点我 +1
      </div>
      <div onClick={() => setState(!state)}>
        结果 ={state}
      </div>
    </React.Fragment>
  )
}
`

const scope = { React, useState, add }

export default function Use() {
  return (
    <Fragment>
      <Playground code={code} scope={scope} />
    </Fragment>
  )
}
