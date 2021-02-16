import React from 'react'
import { useAppConfig } from 'stores/app-config'
import { useGlobalInfo } from 'stores/global-info'
import styles from './index.module.scss'

export default function PageTwo() {
  const { domain } = useAppConfig()
  const { username } = useGlobalInfo()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{domain}</h1>
      <div className={styles.content}>{username}</div>
    </div>
  )
}
