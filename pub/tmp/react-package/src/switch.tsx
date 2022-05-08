import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import cn from 'classnames'
import styles from './switch.scss'

export interface SwitchProps {
  /** 类名 */
  className?: string
  /** 样式 */
  style?: React.CSSProperties
  /** 开关状态 */
  value?: boolean
  /** 更改开关状态 */
  onChange?: (value: boolean) => void
}

export interface SwitchRef {
  /** 根节点 */
  rootNode: HTMLDivElement | null
}

export const Switch = forwardRef<SwitchRef, SwitchProps>(({
  className,
  style,
  value,
  onChange,
}, ref) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    rootNode: rootRef.current
  }), [rootRef.current])

  return (
    <div 
      ref={rootRef}
      style={style}
      className={cn(
        className,
        styles.xrswitch,
        value && styles.active,
      )}
      onClick={() => {
        if (onChange) {
          onChange(!value)
        }
      }}
    >
      <div className={styles.inner} />
    </div>
  )
})
