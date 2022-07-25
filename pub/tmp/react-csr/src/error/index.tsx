import React from 'react'
import { SwitchTheme } from 'xueyan-react-style'
import { NarrowScreen } from 'com/narrow-screen'
import styles from './index.scss'

export default function Index() {
  return (
    <NarrowScreen>
      <div className={styles.wrapper}>
        <img className={styles.icon} src={`${P_ASSETS_PATH}favicon.png`} />
        <div className={styles.title}>ERROR</div>
        <div className={styles.desc}>😭 Page not found or crashed</div>
        <div className={styles.note}>Please check your network and URL</div>
        <SwitchTheme />
      </div>
    </NarrowScreen>
  )
}
