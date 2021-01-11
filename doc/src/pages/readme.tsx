import React from 'react'
import Markdown from 'xueyan-react-markdown'
import readmeStream from '../../../README.md'

export default function Readme() {
  return (
    <Markdown>{readmeStream}</Markdown>
  )
}
