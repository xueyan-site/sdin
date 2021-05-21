import React from 'react'
import styles from './index.module.scss'

export default function Container({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
