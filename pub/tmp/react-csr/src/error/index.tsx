import React from 'react'
import styles from './index.scss'
import FAVICON from 'ast/favicon.png'

export default function Index() {
  return (
    <div className={styles.wrapper}>
      <img className={styles.banner} src={FAVICON} />
      <div className={styles.title}>🙁</div>
      <div className={styles.content}>Page crashed or not found</div>
      <div className={styles.content}>Please check your network and URL</div>
    </div>
  )
}
