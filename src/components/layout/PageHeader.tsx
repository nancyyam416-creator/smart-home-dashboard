import { ArrowLeft, Bell, LockKeyhole, QrCode, ShieldCheck, ShieldOff } from 'lucide-react'
import { IconButton } from '../ui/IconButton'
import { iconButtonClass } from '../ui/styles'

interface PageHeaderProps {
  title: string
  onBack: () => void
  armed: boolean
  onDefense: () => void
}

export function PageHeader({ title, onBack, armed, onDefense }: PageHeaderProps) {
  return (
    <header className="absolute left-[22px] right-[22px] top-[18px] flex h-11 items-center">
      <button type="button" onClick={onBack} className="flex items-center gap-3 bg-transparent text-[25px] font-semibold">
        <ArrowLeft size={28} />
        <span>{title}</span>
      </button>
      <div className="ml-auto flex gap-2.5">
        <button type="button" onClick={onDefense} aria-label={`八路防区已${armed ? '开启，点击撤防' : '撤防，点击开启'}`} className={`${iconButtonClass} relative !flex w-[136px] !items-center !justify-center gap-2 border px-3.5 ${armed ? 'border-aqua/35 bg-[rgba(42,74,78,.88)] text-white' : 'border-white/15 bg-[rgba(66,83,94,.64)] text-white/65'}`}>
          {armed ? <ShieldCheck size={22} className="shrink-0 text-aqua" /> : <ShieldOff size={22} className="shrink-0 text-white/45" />}
          <span className="whitespace-nowrap text-sm leading-none">防区已{armed ? '开启' : '撤防'}</span>
        </button>
        <IconButton label="门锁"><LockKeyhole size={27} /></IconButton>
        <IconButton label="二维码"><QrCode size={27} /></IconButton>
        <IconButton label="告警入口"><Bell size={27} /></IconButton>
      </div>
    </header>
  )
}
