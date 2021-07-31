import React from 'react'
import styles from './index.scss'
import FAVICON from 'ast/favicon.png'

export default function Index(props: any) {
  console.log('[APP]', props)
  return (
    <div className={styles.wrapper}>
      <img className={styles.banner} src={FAVICON} />
      <div className={styles.title}>
        {props.page.name}
      </div>
      <div className={styles.content}>
        Project {props.project.name}
      </div>
      <div className={styles.content}>
        Author {props.project.author}
      </div>
    </div>
  )
}