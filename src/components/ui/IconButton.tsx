import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { iconButtonClass } from './styles'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string
  children: ReactNode
}

export function IconButton({ label, children, className = '', ...props }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} className={`${iconButtonClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
