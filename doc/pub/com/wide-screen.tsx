import React from 'react'
import 'xueyan-react-style'
import './wide-screen.scss'

export function WideScreen({
  children
}: {
  children?: React.ReactElement
}) {
  return children || null
}
