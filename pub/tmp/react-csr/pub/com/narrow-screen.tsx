import React, { useLayoutEffect } from 'react'
import 'xueyan-react-style'
import './narrow-screen.scss'

export function NarrowScreen({
  children
}: {
  children?: React.ReactElement
}) {
  useLayoutEffect(() => {
    const appDom = document.getElementById('app')
    if (appDom) {
      appDom.classList.add('narrow')
    }
  }, [])
  return children || null
}
