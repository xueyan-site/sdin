import React from 'react'
import styles from './index.module.scss'

export default function PageOne() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>page one</h1>
      <div className={styles.content}><%= package.name %></div>
    </div>
  )
}
