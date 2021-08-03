import React from 'react'
import styles from './index.scss'
import FAVICON from 'ast/favicon.png'

export default function Index() {
  return (
    <div className={styles.wrapper}>
      <img className={styles.banner} src={FAVICON} />
      <div className={styles.title}>ERROR</div>
      <div className={styles.content}>You may have encountered some problems</div>
    </div>
  )
}
