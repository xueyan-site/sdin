import React from 'react'
import styles from './index.scss'
import Container from 'com/container'

export default function Index({ page }: any) {
  const [str, setStr] = React.useState<string>('mm8800ttmm')
  return (
    <Container>
      <h1 className={styles.title} onClick={() => {
        setStr(str+ '_')
      }}>{str}</h1>
    </Container>
  )
}
