import React from 'react'
import Container from 'components/container'
import styles from './index.module.scss'

export default function Index() {
  return (
    <Container>
      <h1 className={styles.title}>title</h1>
      <div className={styles.content}>content</div>
    </Container>
  )
}
