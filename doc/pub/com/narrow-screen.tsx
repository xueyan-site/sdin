import React, { Fragment, useLayoutEffect } from 'react'
import 'xueyan-react-style'
import './narrow-screen.scss'

export function NarrowScreen({
  children
}: {
  children?: React.ReactNode
}) {
  useLayoutEffect(() => {
    document.body.classList.add('narrow')
    return () => document.body.classList.remove('narrow')
  }, [])
  return <Fragment>{children}</Fragment>
}
