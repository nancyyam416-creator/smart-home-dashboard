import { useEffect, useId, useRef } from 'react'
import { primaryButtonClass, secondaryButtonClass } from './styles'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmText: string
  confirmTone?: 'orange' | 'green'
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  confirmTone = 'orange',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()
    return () => previousFocusRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-[rgba(3,8,12,.64)] backdrop-blur-[5px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <div className="w-[410px] rounded-[10px] border border-white/15 bg-[rgba(39,49,56,.98)] p-6 shadow-[0_20px_55px_rgba(0,0,0,.45)]">
        <h2 id={titleId} className="text-[21px] font-semibold">{title}</h2>
        <p id={descriptionId} className="my-3 mb-[22px] text-sm leading-7 text-white/65">{description}</p>
        <div className="flex justify-end gap-2.5">
          <button ref={cancelRef} type="button" onClick={onCancel} className={secondaryButtonClass}>取消</button>
          <button type="button" onClick={onConfirm} className={`${primaryButtonClass} ${confirmTone === 'green' ? 'bg-[#20a979]' : 'bg-[#e66b3c]'}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
