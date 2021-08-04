import React, { Fragment, useState } from 'react'
import Playground from 'xueyan-react-playground'
import { add } from '<%= name %>'

const code1 = `
import React, { useState } from 'react'
import { add } from '<%= name %>'

export default function UseSwitch() {
  const [state, setState] = useState<number>(1)
  return (
    <React.Fragment>
      <div onClick={() => setState(add(1, state))}>
        click +1
      </div>
      <div onClick={() => setState(!state)}>
        result ={state}
      </div>
    </React.Fragment>
  )
}
`

const scope = { React, useState, add }

export default function Use() {
  return (
    <Fragment>
      <Playground code={code1} scope={scope} />
    </Fragment>
  )
}
