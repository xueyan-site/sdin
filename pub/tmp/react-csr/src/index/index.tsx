import React from 'react'
import styles from './index.scss'
import { PageProps } from 'xueyan-react'

export default function Index(props: PageProps) {
  return (
    <div className={styles.wrapper}>
      <img className={styles.icon} src={`${XT_PATH}favicon.png`} />
      <div className={styles.title}>😊 {props.page.name}</div>
      <div className={styles.content}>{XT_NAME}</div>
      <div className={styles.content}>{XT_AUTHOR}</div>
    </div>
  )
}
