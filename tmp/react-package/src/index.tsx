/**
 * @package <%= name %>
 * @author <%= author %>
 * @description 包入口
 */

import React from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

/**
 * 开关组件的参数  
 */
export interface SwitchProps {
  /**
   * 开关状态（on或off） 
   */
  value?: boolean
  /**
   * 设置开关状态  
   */
  onChange?: (value: boolean) => void
  /**
   * 设置为块级元素（或不设置）  
   */
  block?: boolean
  /**
   * 开关组件的class  
   */
  className?: string
  /**
   * 开关组件的样式  
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
