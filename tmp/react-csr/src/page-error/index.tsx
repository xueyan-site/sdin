import React from 'react'
import styles from './index.scss'
import Container from 'com/container'

export default function Index({ page }: any) {
  return (
    <Container>
      <h1 className={styles.title}>
        {page.name}
      </h1>
    </Container>
  )
}
