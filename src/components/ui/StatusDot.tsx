interface StatusDotProps {
  tone?: 'online' | 'offline' | 'warning'
}

const toneClass = {
  online: 'bg-aqua shadow-[0_0_6px_rgba(101,238,227,.45)]',
  offline: 'bg-[#9ba5aa]',
  warning: 'bg-accent shadow-[0_0_6px_rgba(255,120,67,.4)]',
}

export function StatusDot({ tone = 'online' }: StatusDotProps) {
  return <span aria-hidden className={`inline-block size-1.5 shrink-0 rounded-full ${toneClass[tone]}`} />
}
