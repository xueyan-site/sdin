/**
 * @package <%= name %>
 * @author <%= author %>
 * @description package entry
 */

import React from 'react'
import cn from 'classnames'
import styles from './index.scss'

/**
 * component props  
 */
export interface SwitchProps {
  /**
   * switch status（on或off） 
   */
  value?: boolean
  
  /**
   * set switch status  
   */
  onChange?: (value: boolean) => void

  /**
   * set to block element or not
   */
  block?: boolean

  /**
   * switch component class name
   */
  className?: string

  /**
   * switch component style
   */
  style?: React.CSSProperties
}

export function Switch({
  value,
  onChange,
  block,
  className,
  style
}: SwitchProps) {
  return (
    <div 
      className={cn(
        styles.wrapper, 
        value && styles.active, 
        block && styles.block, 
        className
      )}
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
