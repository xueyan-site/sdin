/**
 * @package <%= package.name %>
 * @author <%= package.author %>
 * @description 包入口 package entry
 */

import React from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

/**
 * 开关组件的参数  
 * switch component props  
 */
export interface SwitchProps {
  /**
   * 开关状态（on或off） 
   * switch state (on or off)  
   */
  value?: boolean
  /**
   * 设置开关状态  
   * set switch state  
   */
  onChange?: (value: boolean) => void
  /**
   * 设置为块级元素（或不设置）  
   * it is block or not  
   */
  block?: boolean
  /**
   * 开关组件的class  
   * switch className  
   */
  className?: string
  /**
   * 开关组件的样式  
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
