import React from 'react'
import { SwitchTheme } from 'xueyan-react-style'
import { PageProps } from 'xueyan-react'
import { NarrowScreen } from 'com/narrow-screen'
import styles from './index.scss'

export default function Index(props: PageProps) {
  return (
    <NarrowScreen>
      <div className={styles.wrapper}>
        <img className={styles.icon} src={`${P_ASSETS_PATH}favicon.png`} />
        <div className={styles.title}>{props.page.name}</div>
        <div className={styles.desc}>😊 Welcom to {P_NAME}</div>
        <div className={styles.note}>{P_AUTHOR}</div>
        <SwitchTheme />
      </div>
    </NarrowScreen>
  )
}
