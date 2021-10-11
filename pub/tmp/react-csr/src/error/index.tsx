import React from 'react'
import styles from './index.scss'

export default function Index() {
  return (
    <div className={styles.wrapper}>
      <img className={styles.banner} src={`${XT_PATH}favicon.png`} />
      <div className={styles.title}>🙁</div>
      <div className={styles.content}>Page crashed or not found</div>
      <div className={styles.content}>Please check your network and URL</div>
    </div>
  )
}
