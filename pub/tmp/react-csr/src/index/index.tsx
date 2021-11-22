import React from 'react'
import styles from './index.scss'
import { PageProps } from 'xueyan-react'
import FAVICON from 'ast/favicon.png'

export default function Index(props: PageProps) {
  console.log('[PAGE]', props.page)
  return (
    <div className={styles.wrapper}>
      <img className={styles.banner} src={FAVICON} />
      <div className={styles.title}>
        {props.page.name}
      </div>
      <div className={styles.content}>
        {XT_NAME}
      </div>
      <div className={styles.content}>
        {XT_AUTHOR}
      </div>
    </div>
  )
}
