import React from 'react'
import styles from './index.module.scss'

export default function PageTwo() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>page two</h1>
      <div className={styles.content}><%= package.name %></div>
    </div>
  )
}
