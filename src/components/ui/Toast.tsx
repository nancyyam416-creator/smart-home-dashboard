export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute bottom-[38px] left-1/2 z-50 -translate-x-1/2 rounded-full border border-accent/60 bg-[rgba(17,26,31,.94)] px-[22px] py-3 transition ${message ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
    >
      {message || '　'}
    </div>
  )
}
