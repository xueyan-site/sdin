import React from 'react'
import styles from './video.scss'

export default function Video({
  src,
  width,
}: {
  src: string
  width?: React.CSSProperties['width']
}) {
  return (
    <video
      muted
      autoPlay
      controls
      className={styles.video}
      style={{ width }}
      src={src}
    />
  )
}
