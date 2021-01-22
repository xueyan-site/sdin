/**
 * @package <%= package.name %>
 * @author <%= package.author %>
 * @description package entry
 */

import React from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

/**
 * switch component props
 */
export interface SwitchProps {
  /**
   * switch state (on or off)
   */
  value?: boolean
  /**
   * set switch state
   */
  onChange?: (value: boolean) => void
  /**
   * it is block or not ?
   */
  block?: boolean
  /**
   * switch className
   */
  className?: string
  /**
   * switch style
   */
  style?: React.CSSProperties
}

export default function Switch({
  value,
  onChange,
  block,
  className,
  style
}: SwitchProps) {
  return (
    <div 
      className={classNames(styles.wrapper, value && styles.active, block && styles.block, className)} 
      style={style}
      onClick={() => {
        if (onChange) {
          onChange(!value)
        }
      }}
    >
      <div className={styles.inner} />
    </div>
  )
}
