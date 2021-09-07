import React from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'
import readme from '../../../README.md'

export default function Readme() {
  return <MarkdownSegment>{readme}</MarkdownSegment>
}
