import { useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpFromLine,
  Bell,
  ChevronDown,
  CircleDot,
  Clock3,
  CloudFog,
  DoorOpen,
  Droplets,
  Dumbbell,
  Expand,
  Eye,
  FlaskConical,
  Home,
  HousePlug,
  LockKeyhole,
  MapPin,
  Minimize2,
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  QrCode,
  Settings,
  ShieldCheck,
  ShieldOff,
  Shirt,
  Thermometer,
  ThermometerSun,
  Video,
  Waves,
  Wind,
} from 'lucide-react'
import { PageHeader } from './components/layout/PageHeader'
import { ConfirmDialog } from './components/ui/ConfirmDialog'
import { IconButton } from './components/ui/IconButton'
import { StatusDot } from './components/ui/StatusDot'
import { Toast } from './components/ui/Toast'
import { glassSurfaceClass, iconButtonClass } from './components/ui/styles'

type Page = 'home' | 'intercom' | 'angel'
type Camera = 'door' | 'garage'
type RecordTab = 'call' | 'door'
type Simulation = 'intercom' | 'security' | null

const glass = glassSurfaceClass
const iconButton = iconButtonClass
const detailGlass = 'rounded-[10px] border-0 bg-[rgba(217,217,216,.10)] shadow-[inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-[86px]'
const availabilityLabel = (offlineCount: number) => offlineCount > 0 ? `${offlineCount}离线` : '在线'
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

const outdoorItems = [
  { value: '35%', label: '湿度', icon: Droplets },
  { value: '40', unit: 'μg/m³', label: 'PM2.5', icon: Waves },
  { value: '2级', label: '风力风向', icon: Wind },
  { value: '弱', label: '紫外线', icon: CircleDot },
  { value: '舒适', label: '穿衣', icon: Shirt },
  { value: '适宜', label: '运动', icon: Dumbbell },
]

const indoorMetrics = [
  { value: '18', unit: '℃', label: '温度', icon: Thermometer },
  { value: '49', unit: '%', label: '湿度', icon: Droplets },
  { value: '500', unit: 'ppm', label: '二氧化碳', icon: CloudFog },
  { value: '10', unit: 'μg/m³', label: 'PM2.5', icon: Waves },
  { value: '0.03', unit: 'mg/m³', label: '甲醛', icon: FlaskConical },
]

function Sidebar() {
  const nav = [{ label: '首页', icon: Home }, { label: '六恒系统', icon: ThermometerSun }, { label: '智能家居', icon: HousePlug }, { label: '设置', icon: Settings }]
  return <aside className="absolute inset-y-0 left-0 z-10 flex w-[107px] flex-col items-center gap-[38px] bg-[rgba(9,20,29,.91)] pt-[86px] backdrop-blur-[18px]">
    {nav.map(({ label, icon: Icon }, index) => <button key={label} type="button" className={`flex h-[78px] w-full flex-col items-center justify-center gap-2 text-base transition hover:bg-white/5 ${index === 0 ? 'text-accent' : 'text-[#d7dde1]'}`}><Icon size={31} strokeWidth={2.2} /><span>{label}</span></button>)}
  </aside>
}

function TopActions({ armed, onDefense, onIntercomSimulation, onSecuritySimulation }: { armed: boolean; onDefense: () => void; onIntercomSimulation: () => void; onSecuritySimulation: () => void }) {
  return <div className="absolute right-[25px] top-[22px] z-20 flex gap-2.5">
    <button type="button" onClick={onIntercomSimulation} className={`${iconButton} !flex w-[112px] !items-center !justify-center gap-2 px-3 text-[13px]`}><PhoneIncoming size={19} className="text-aqua" /><span className="whitespace-nowrap">对讲模拟</span></button>
    <button type="button" onClick={onSecuritySimulation} className={`${iconButton} !flex w-[112px] !items-center !justify-center gap-2 px-3 text-[13px]`}><AlertTriangle size={19} className="text-accent" /><span className="whitespace-nowrap">安防模拟</span></button>
    <button type="button" onClick={onDefense} aria-label={`八路防区已${armed ? '开启，点击撤防' : '撤防，点击开启'}`} className={`${iconButton} relative !flex w-[136px] !items-center !justify-center gap-2 border px-3.5 ${armed ? 'border-aqua/35 bg-[rgba(42,74,78,.88)] text-white' : 'border-white/15 bg-[rgba(66,83,94,.64)] text-white/65'}`}>{armed ? <ShieldCheck size={22} className="shrink-0 text-aqua" /> : <ShieldOff size={22} className="shrink-0 text-white/45" />}<span className="whitespace-nowrap text-sm leading-none">防区已{armed ? '开启' : '撤防'}</span></button>
    <IconButton label="门锁"><LockKeyhole size={27} /></IconButton>
    <IconButton label="二维码"><QrCode size={27} /></IconButton>
    <IconButton label="告警入口"><Bell size={27} /></IconButton>
  </div>
}

function ServiceCard({ title, icon: Icon, status, statusTone = 'online', large = false, statusPill = false, onClick, success = false }: { title: string; icon: typeof Eye; status: string; statusTone?: 'online' | 'offline' | 'warning'; large?: boolean; statusPill?: boolean; onClick: () => void; success?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`${glass} absolute overflow-hidden !border-0 bg-[linear-gradient(110deg,rgba(66,76,82,.94),rgba(82,84,84,.90))] text-left backdrop-blur-[28px] transition duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_20px_rgba(0,0,0,.18)] active:translate-y-0 active:scale-[.985] active:shadow-[0_0_0_2px_rgba(255,120,67,.52),0_6px_16px_rgba(0,0,0,.22)] ${large ? 'left-0 top-0 flex h-[229px] w-[228px] flex-col items-center justify-center' : 'inset-0 flex h-full w-full items-center px-[18px]'} ${success ? 'animate-success shadow-[0_0_0_2px_rgba(101,238,227,.55),0_0_18px_rgba(101,238,227,.2)]' : ''}`}>
      {large ? <>
        <span className="grid size-[72px] place-items-center rounded-2xl border border-accent/25 bg-[rgba(255,120,67,.10)] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,.05)]"><Icon size={42} strokeWidth={1.65} /></span>
        <strong className="mt-4 text-[22px] font-medium tracking-[.5px]">{title}</strong>
        <span className="mt-8 flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1.5 text-[11px] text-white/62"><StatusDot tone={statusTone} />{status}</span>
      </> : <>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/20 bg-[rgba(255,120,67,.09)] text-accent"><Icon size={23} strokeWidth={1.7} /></span>
        <span className="ml-3.5 min-w-0"><strong className="block truncate text-[17px] font-medium tracking-[.2px]">{title}</strong><span className={`mt-2 flex w-fit items-center gap-1.5 whitespace-nowrap text-[11px] text-white/55 ${statusPill ? 'rounded-full bg-black/15 px-2.5 py-1.5' : ''}`}><StatusDot tone={statusTone} />{status}</span></span>
      </>}
    </button>
  )
}

function HomePage({ onNavigate, showToast }: { onNavigate: (page: Page) => void; showToast: (message: string) => void }) {
  const intercomOfflineCount = 0
  const angelOfflineCount = 0
  const [liftSent, setLiftSent] = useState(false)
  const sendLift = () => {
    setLiftSent(true)
    showToast('呼梯指令已发送')
    window.setTimeout(() => setLiftSent(false), 4000)
  }
  return <section className="absolute inset-0 z-[2]">
    <img src={assetUrl('assets/brand/gr-green-tech.png')} alt="GR Green Tech 国锐科技" className="pointer-events-none absolute left-[153px] top-[36px] h-[54px] w-auto max-w-none select-none" />
    <div className="absolute left-[153px] top-[128px] h-[672px] w-[471px]">
      <div className="relative h-[130px] w-[471px] overflow-hidden rounded-[10px]" data-node-id="41:4085">
        <img src={assetUrl('assets/figma/node-41-4085.png')} alt="" className="pointer-events-none absolute left-[-153px] top-[-128px] h-[800px] w-[1280px] max-w-none select-none" />
        <span className="sr-only">15:19，11月5号星期日，北京市朝阳区，小雨，5至12度</span>
      </div>
      <div className="absolute left-0 top-[145px] h-20 w-[471px] overflow-hidden rounded-[10px]" data-node-id="41:4085-music">
        <img src={assetUrl('assets/figma/node-41-4085.png')} alt="" className="pointer-events-none absolute left-[-153px] top-[-273px] h-[800px] w-[1280px] max-w-none select-none" />
        <span aria-hidden className="absolute bottom-0 left-[354px] h-[12px] w-[38px] bg-[#4a5459]" />
        <span className="sr-only">音乐播放控制</span>
      </div>
      <div className="absolute left-0 top-[247px] h-[229px] w-[471px]">
        <ServiceCard title="可视对讲" icon={DoorOpen} status={availabilityLabel(intercomOfflineCount)} statusTone={intercomOfflineCount > 0 ? 'warning' : 'online'} large onClick={() => onNavigate('intercom')} />
        <div className="absolute left-[244px] top-0 h-[107px] w-[227px]"><ServiceCard title="天使之眼" icon={Eye} status={availabilityLabel(angelOfflineCount)} statusTone={angelOfflineCount > 0 ? 'warning' : 'online'} statusPill onClick={() => onNavigate('angel')} /></div>
        <div className="absolute left-[244px] top-[123px] h-[106px] w-[227px]"><ServiceCard title="一键呼梯" icon={ArrowUpFromLine} status="在线" statusPill success={liftSent} onClick={sendLift} /></div>
      </div>
      <h2 className="absolute left-0 top-[500px] text-[22px] font-semibold">室外环境</h2>
    </div>
    <div className="absolute left-[154px] top-[667px] grid h-[106px] w-[1069px] grid-cols-6 gap-3.5">
      {outdoorItems.map(({ value, unit, label, icon: Icon }) => <article key={label} className={`${glass} relative flex flex-col justify-center overflow-hidden !border-0 bg-[linear-gradient(110deg,rgba(63,73,79,.92),rgba(53,65,71,.88))] px-4 backdrop-blur-[86px]`}>
        <strong className="flex items-baseline whitespace-nowrap text-[26px] font-medium leading-none tracking-[-.3px]">{value}{unit && <small className="ml-0.5 text-[11px] font-normal tracking-normal text-white/78">{unit}</small>}</strong>
        <span className="mt-2 block text-[13px] leading-none text-white/58">{label}</span>
        <span className="absolute right-3 top-4 grid size-[30px] place-items-center rounded-full bg-[rgba(255,120,67,.09)] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,.05)]"><Icon size={16} strokeWidth={1.8} /></span>
      </article>)}
    </div>
    <div className="absolute left-[674px] top-[132px] h-[469px] w-[552px]">
      <div className={`${glass} absolute inset-0 !border-0 bg-[linear-gradient(120deg,rgba(62,73,79,.94),rgba(73,76,76,.90))] px-[26px] pb-[18px] pt-10 text-center backdrop-blur-[36px]`}>
        <div className="relative mx-auto h-[219px] w-[220px]">
          <svg aria-hidden viewBox="0 0 220 210" className="absolute left-1/2 top-0 size-[210px] -translate-x-1/2 overflow-visible">
            <path d="M43 184 A103 103 0 0 1 43 26" fill="none" stroke="rgba(101,238,227,.34)" strokeWidth="2" strokeLinecap="round" />
            <path d="M177 26 A103 103 0 0 1 177 184" fill="none" stroke="rgba(101,238,227,.34)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="110" cy="105" r="94" fill="rgba(33,44,49,.12)" stroke="#70f0d1" strokeWidth="9" />
            <circle cx="110" cy="105" r="87" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
          </svg>
          <div className="absolute left-1/2 top-[33px] grid size-[144px] -translate-x-1/2 place-items-center text-[76px] font-light">优</div>
          <div className="absolute left-1/2 top-[178px] z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#2ca8e1] to-[#18bc87] px-4 py-1.5 text-[13px] shadow-[0_4px_12px_rgba(24,188,135,.20)]"><Waves size={14} />空气质量</div>
        </div>
        <div className="grid h-[182px] w-[506px] grid-rows-2 overflow-hidden rounded-[10px] bg-[rgba(35,51,58,.58)] backdrop-blur-[28px]">
          <div className="grid grid-cols-3">
            {indoorMetrics.slice(0, 3).map(({ value, unit, label, icon: Icon }, index) => <div key={label} className={`flex flex-col justify-center ${index < 2 ? 'border-r border-white/10' : ''}`}><strong className="text-[22px] font-normal leading-none">{value}<small className="ml-0.5 text-[13px] font-normal text-white/78">{unit}</small></strong><span className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-white/58"><Icon size={13} className="text-accent" strokeWidth={2} />{label}</span></div>)}
          </div>
          <div className="grid grid-cols-2 border-t border-white/8">
            {indoorMetrics.slice(3).map(({ value, unit, label, icon: Icon }, index) => <div key={label} className={`flex flex-col justify-center ${index === 0 ? 'border-r border-white/10' : ''}`}><strong className="text-[22px] font-normal leading-none">{value}<small className="ml-0.5 text-[13px] font-normal text-white/78">{unit}</small></strong><span className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-white/58"><Icon size={13} className="text-accent" strokeWidth={2} />{label}</span></div>)}
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-0 z-10 flex h-16 w-full items-center justify-between px-[22px]"><h2 className="text-[22px] font-semibold tracking-[.2px]">室内环境</h2><button type="button" className="flex items-center gap-1.5 rounded-full bg-[rgba(43,59,67,.72)] px-[18px] py-2 text-[16px] text-white/90 backdrop-blur-[20px] transition hover:bg-[rgba(53,69,76,.84)]">客厅<ChevronDown size={15} /></button></div>
    </div>
  </section>
}

const callRecords = [
  ['单元门口机一', '已开门', '01-30 04:04', '已接通'],
  ['单元门口机二', '已开门', '01-28 12:04', '未接通'],
  ['单元门口机一', '未开门', '01-26 07:07', '已接通'],
  ['单元门口机一', '已开门', '01-22 10:10', '已挂断'],
]
const doorRecords = [
  ['单元门口机一', '已开门', '01-30 04:04', '住户开门'],
  ['单元门口机二', '已开门', '01-28 12:04', '远程开门'],
  ['单元门口机一', '已开门', '01-22 10:10', '访客通行'],
]

function IncomingCallSimulation({ onClose, showToast }: { onClose: () => void; showToast: (message: string) => void }) {
  const [callState, setCallState] = useState<'incoming' | 'connected'>('incoming')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const openDoor = () => {
    setConfirmOpen(false)
    showToast('单元门口机一已开门')
  }
  const endCall = () => {
    onClose()
    showToast(callState === 'connected' ? '通话已结束' : '已挂断访客呼叫')
  }
  return <>
    <div className="absolute inset-0 z-[35] flex items-center justify-center bg-[rgba(3,8,12,.66)] backdrop-blur-[7px]" role="dialog" aria-modal="true" aria-label="门口机呼入模拟">
      <div className={`${detailGlass} w-[760px] p-4 shadow-[0_24px_70px_rgba(0,0,0,.48)]`}>
        <div className="mb-3 flex h-[64px] items-center justify-between px-2">
          <div className="flex items-center gap-3.5">
            <span className={`grid size-10 place-items-center rounded-full ${callState === 'incoming' ? 'animate-pulse bg-accent/16 text-accent' : 'bg-aqua/12 text-aqua'}`}>{callState === 'incoming' ? <PhoneIncoming size={22} /> : <PhoneCall size={22} />}</span>
            <span><strong className="block text-[18px] font-semibold">单元门口机一</strong><span className="mt-1.5 block text-[12px] text-white/48">{callState === 'incoming' ? '访客正在呼叫' : '通话中 · 00:08'}</span></span>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-[11px] ${callState === 'incoming' ? 'bg-accent/12 text-accent' : 'border border-aqua/30 bg-[rgba(44,75,76,.58)] text-white/82'}`}>{callState === 'incoming' ? '呼入中' : '已接通'}</span>
        </div>
        <div className="relative h-[430px] overflow-hidden rounded-[10px] bg-[#172129] bg-cover bg-center shadow-[0_10px_28px_rgba(0,0,0,.22)]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.04),rgba(0,0,0,.16)),url('${assetUrl('assets/intercom/unit-door-1.png')}')` }}>
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[rgba(18,29,35,.70)] px-3 py-2 text-[11px] text-white/78 backdrop-blur-[18px]"><Video size={14} className="text-aqua" /><StatusDot />实时画面</span>
        </div>
        <div className="flex h-[82px] items-end justify-center gap-4 pb-1">
          {callState === 'incoming' ? <>
            <button type="button" onClick={endCall} className="flex h-[48px] min-w-[132px] items-center justify-center gap-2 rounded-full bg-[rgba(188,64,56,.88)] px-6 text-[16px] font-medium text-white transition hover:brightness-110 active:scale-[.98]"><PhoneOff size={20} />挂断</button>
            <button type="button" onClick={() => setConfirmOpen(true)} className="flex h-[48px] min-w-[132px] items-center justify-center gap-2 rounded-full bg-accent px-6 text-[16px] font-medium text-white shadow-[0_8px_20px_rgba(255,120,67,.20)] transition hover:brightness-110 active:scale-[.98]"><DoorOpen size={20} />开门</button>
            <button type="button" onClick={() => { setCallState('connected'); showToast('已接通单元门口机一') }} className="flex h-[48px] min-w-[132px] items-center justify-center gap-2 rounded-full bg-[#20a979] px-6 text-[16px] font-medium text-white shadow-[0_8px_20px_rgba(32,169,121,.22)] transition hover:brightness-110 active:scale-[.98]"><PhoneCall size={20} />接听</button>
          </> : <>
            <button type="button" onClick={() => setConfirmOpen(true)} className="flex h-[48px] min-w-[132px] items-center justify-center gap-2 rounded-full bg-accent px-6 text-[16px] font-medium text-white shadow-[0_8px_20px_rgba(255,120,67,.20)] transition hover:brightness-110 active:scale-[.98]"><DoorOpen size={20} />开门</button>
            <button type="button" onClick={endCall} className="flex h-[48px] min-w-[132px] items-center justify-center gap-2 rounded-full bg-[rgba(188,64,56,.88)] px-6 text-[16px] font-medium text-white transition hover:brightness-110 active:scale-[.98]"><PhoneOff size={20} />结束通话</button>
          </>}
        </div>
      </div>
    </div>
    <ConfirmDialog open={confirmOpen} title="确认打开单元门口机一对应入口？" description="将发送开门指令，请确认实时画面中的访客身份。" confirmText="确认开门" onCancel={() => setConfirmOpen(false)} onConfirm={openDoor} />
  </>
}

function SecurityAlarmSimulation({ onClose, showToast }: { onClose: () => void; showToast: (message: string) => void }) {
  const alarms = [
    { zone: '3路', location: '客厅红外', time: '15:19:32' },
    { zone: '5路', location: '入户门磁', time: '15:18:46' },
    { zone: '8路', location: '厨房燃气', time: '15:17:09' },
  ]
  const acknowledge = () => {
    onClose()
    showToast(`已知晓 ${alarms.length} 条报警，记录已保留`)
  }
  return <div className="absolute inset-0 z-[35] flex items-center justify-center bg-[rgba(3,8,12,.68)] backdrop-blur-[7px]" role="dialog" aria-modal="true" aria-labelledby="security-alarm-title">
    <div className={`${detailGlass} w-[560px] overflow-hidden p-6 shadow-[0_24px_70px_rgba(0,0,0,.52)]`}>
      <div className="flex items-start gap-4">
        <span className="grid size-[54px] shrink-0 place-items-center rounded-2xl bg-[rgba(217,62,49,.16)] text-[#ff6658] shadow-[0_0_22px_rgba(255,76,61,.14)]"><AlertTriangle size={30} strokeWidth={2.2} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4"><h2 id="security-alarm-title" className="text-[22px] font-semibold">安防报警</h2><span className="rounded-full bg-[rgba(217,62,49,.16)] px-3 py-1.5 text-[12px] font-medium text-[#ff7569]">{alarms.length}处报警</span></div>
          <p className="mt-2 text-[14px] leading-6 text-white/58">检测到多个防区异常触发，请及时确认现场情况。</p>
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        {alarms.map((alarm, index) => <div key={`${alarm.zone}-${alarm.time}`} className="grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-[10px] bg-[rgba(217,217,216,.075)] px-4 py-3 text-[13px]">
          <span className={`grid size-[30px] place-items-center rounded-lg ${index === 0 ? 'bg-[rgba(217,62,49,.16)] text-[#ff6658]' : 'bg-[rgba(255,120,67,.10)] text-accent'}`}><MapPin size={16} /></span>
          <div><span className="block text-[11px] text-white/38">报警防区</span><strong className="mt-0.5 block font-medium text-white/86">{alarm.zone} · {alarm.location}</strong></div>
          <div className="min-w-[88px]"><span className="block text-[11px] text-white/38">触发时间</span><strong className="mt-0.5 flex items-center gap-1.5 font-medium text-white/72"><Clock3 size={14} className="text-accent" />{alarm.time}</strong></div>
        </div>)}
      </div>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={acknowledge} className="h-[42px] min-w-[124px] rounded-full bg-[rgba(211,67,55,.92)] px-5 text-[14px] font-medium text-white shadow-[0_8px_20px_rgba(211,67,55,.20)] transition hover:brightness-110 active:scale-[.98]">已知晓</button>
      </div>
    </div>
  </div>
}

function IntercomPage({ onBack, showToast, armed, onDefense }: { onBack: () => void; showToast: (message: string) => void; armed: boolean; onDefense: () => void }) {
  const [camera, setCamera] = useState<Camera>('door')
  const [tab, setTab] = useState<RecordTab>('call')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [doorState, setDoorState] = useState<'idle' | 'sending' | 'success'>('idle')
  const cameraName = camera === 'door' ? '单元门口机一' : '单元门口机二'
  const openDoor = () => {
    setConfirmOpen(false)
    setDoorState('sending')
    window.setTimeout(() => {
      setDoorState('success')
      showToast(`${cameraName}已开门`)
      window.setTimeout(() => setDoorState('idle'), 3000)
    }, 900)
  }
  const records = tab === 'call' ? callRecords : doorRecords
  return <section className="absolute inset-0 z-30 bg-cover bg-center px-5 pb-5 pt-20" style={{ backgroundImage: `linear-gradient(rgba(13,20,28,.70),rgba(0,5,9,.76)),url('${assetUrl('assets/figma/raw-1.png')}')` }}>
    <PageHeader title="可视对讲" onBack={onBack} armed={armed} onDefense={onDefense} />
    <div className="grid h-[700px] grid-cols-[170px_minmax(0,1fr)_275px] gap-3.5">
      <aside className={`${detailGlass} p-4`}>
        <h2 className="mb-[18px] text-[17px] font-semibold tracking-[.2px]">监控列表</h2>
        {(['door','garage'] as Camera[]).map((item) => <button key={item} type="button" aria-pressed={camera === item} onClick={() => setCamera(item)} className={`relative mb-3 h-[96px] w-full overflow-hidden rounded-[10px] border bg-cover bg-center text-left transition duration-150 hover:brightness-110 active:scale-[.985] ${camera === item ? 'border-accent shadow-[0_0_0_1px_rgba(255,120,67,.18),0_8px_18px_rgba(0,0,0,.16)]' : 'border-transparent'}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.18),rgba(0,0,0,.58)),url('${assetUrl(`assets/intercom/${item === 'door' ? 'unit-door-1.png' : 'unit-door-2.png'}`)}')` }}>
          <span className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-2.5 text-[13px] font-medium"><span>{item === 'door' ? '单元门口机一' : '单元门口机二'}</span>{camera === item && <span className="text-[10px] font-normal text-aqua">当前</span>}</span>
        </button>)}
      </aside>
      <main className={`${detailGlass} flex min-w-0 flex-col p-4`}>
        <div className="mb-3 flex h-[40px] shrink-0 items-center justify-center gap-2.5 text-[17px] font-semibold"><span className="leading-none">{cameraName}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-aqua/30 bg-[rgba(44,75,76,.58)] px-2.5 py-1.5 text-[11px] font-normal leading-none text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_0_10px_rgba(101,238,227,.08)]"><StatusDot />在线</span></div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[10px] bg-[#172129] bg-cover bg-center shadow-[0_10px_28px_rgba(0,0,0,.18)]" style={{ backgroundImage: `url('${assetUrl(`assets/intercom/${camera === 'door' ? 'unit-door-1.png' : 'unit-door-2.png'}`)}')` }}>
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[rgba(18,29,35,.70)] px-3 py-2 text-[11px] text-white/78 backdrop-blur-[18px]"><Video size={14} className="text-aqua" /><StatusDot />实时监控</span>
        </div>
        <button type="button" disabled={doorState === 'sending'} onClick={() => setConfirmOpen(true)} className={`mx-auto mt-4 h-[48px] min-w-[152px] rounded-full px-8 text-[17px] font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,.22)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[.98] disabled:cursor-wait ${doorState === 'success' ? 'bg-[#20a979]' : doorState === 'sending' ? 'bg-[#5c6d76]' : 'bg-accent'}`}>{doorState === 'success' ? '已开门' : doorState === 'sending' ? '指令发送中…' : '开门'}</button>
      </main>
      <aside className={`${detailGlass} overflow-hidden px-4 py-[18px]`}>
        <div role="tablist" aria-label="对讲记录" className="mb-4 grid h-[42px] grid-cols-2 gap-2">{(['call','door'] as RecordTab[]).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`relative text-[17px] transition ${tab === item ? 'font-semibold text-accent after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-[34px] after:-translate-x-1/2 after:rounded-full after:bg-accent' : 'text-white/42 hover:text-white/68'}`}>{item === 'call' ? '呼叫记录' : '开门记录'}</button>)}</div>
        <div className="flex flex-col gap-2.5">{records.map(([name,state,time,result]) => <article key={`${time}-${result}`} className="rounded-[10px] border-0 bg-[rgba(217,217,216,.075)] px-3.5 py-3.5 backdrop-blur-[36px]">
          <div className="flex items-center justify-between gap-2"><span className="truncate text-[14px] font-medium text-white/88">{name}</span><span className={`shrink-0 text-[13px] font-medium ${state === '已开门' ? 'text-accent' : 'text-white/72'}`}>{state}</span></div>
          <div className="mt-2.5 flex items-center gap-4 text-[11px] font-normal text-white/38"><span className="flex items-center gap-1.5"><Clock3 size={12} />{time}</span><span className="flex items-center gap-1.5"><PhoneCall size={12} />{result}</span></div>
        </article>)}</div>
      </aside>
    </div>
    <ConfirmDialog open={confirmOpen} title={`确认打开${cameraName}对应入口？`} description={`将为${cameraName}发送开门指令，请确认监控画面中的访客身份。`} confirmText="确认开门" onCancel={() => setConfirmOpen(false)} onConfirm={openDoor} />
  </section>
}

function AngelPage({ onBack, armed, onDefense }: { onBack: () => void; armed: boolean; onDefense: () => void }) {
  const [zone, setZone] = useState<1 | 2>(1)
  const [fullscreen, setFullscreen] = useState(false)
  const zoneName = zone === 1 ? '区域一 · 儿童活动区' : '区域二 · 社区健身区'
  return <section className="absolute inset-0 z-30 bg-cover bg-center px-5 pb-5 pt-20" style={{ backgroundImage: `linear-gradient(rgba(13,20,28,.70),rgba(0,5,9,.76)),url('${assetUrl('assets/figma/raw-1.png')}')` }}>
    <PageHeader title="天使之眼" onBack={onBack} armed={armed} onDefense={onDefense} />
    <div className={`grid h-[700px] gap-3.5 ${fullscreen ? 'grid-cols-1' : 'grid-cols-[180px_minmax(0,1fr)]'}`}>
      {!fullscreen && <aside className={`${detailGlass} p-4`}>
        <h2 className="mb-[18px] text-[17px] font-semibold tracking-[.2px]">监控区域</h2>
        {([1,2] as const).map((item) => <button key={item} type="button" aria-pressed={zone === item} onClick={() => setZone(item)} className={`relative mb-3 h-[96px] w-full overflow-hidden rounded-[10px] border bg-cover bg-center text-left transition duration-150 hover:brightness-110 active:scale-[.985] ${zone === item ? 'border-accent shadow-[0_0_0_1px_rgba(255,120,67,.18),0_8px_18px_rgba(0,0,0,.16)]' : 'border-transparent'}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.18),rgba(0,0,0,.58)),url('${assetUrl(`assets/figma/${item === 1 ? 'raw-2.jpeg' : 'raw-3.jpeg'}`)}')` }}>
          <span className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-2.5"><span className="text-[13px] font-medium">区域{item === 1 ? '一' : '二'}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 text-[10px] font-normal text-white/75"><StatusDot />在线</span></span>
        </button>)}
      </aside>}
      <main className={`${detailGlass} relative flex min-w-0 flex-col p-4`}>
        <div className="mb-3 flex h-[40px] shrink-0 items-center justify-center gap-2.5 text-[17px] font-semibold"><span className="leading-none">{zoneName}</span><span className="inline-flex items-center gap-1.5 rounded-full border border-aqua/30 bg-[rgba(44,75,76,.58)] px-2.5 py-1.5 text-[11px] font-normal leading-none text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_0_10px_rgba(101,238,227,.08)]"><StatusDot />在线</span></div>
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[10px] bg-[#172129] bg-cover bg-center shadow-[0_10px_28px_rgba(0,0,0,.18)]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.16)),url('${assetUrl(`assets/figma/${zone === 1 ? 'raw-2.jpeg' : 'raw-3.jpeg'}`)}')` }}>
          <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[rgba(18,29,35,.70)] px-3 py-2 text-[11px] text-white/78 backdrop-blur-[18px]"><Video size={14} className="text-aqua" /><StatusDot />实时监控</span>
        </div>
        <button type="button" aria-label={fullscreen ? '退出全屏' : '全屏查看'} onClick={() => setFullscreen((value) => !value)} className="absolute bottom-[30px] right-[30px] grid size-11 place-items-center rounded-[12px] border-0 bg-[rgba(44,59,67,.78)] text-white shadow-[0_8px_18px_rgba(0,0,0,.22)] backdrop-blur-[18px] transition hover:bg-accent active:scale-95">{fullscreen ? <Minimize2 size={22} /> : <Expand size={22} />}</button>
      </main>
    </div>
  </section>
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [armed, setArmed] = useState(true)
  const [defenseConfirm, setDefenseConfirm] = useState(false)
  const [simulation, setSimulation] = useState<Simulation>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)
  const showToast = (message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 1800)
  }
  const toggleDefense = () => {
    setArmed((value) => !value)
    setDefenseConfirm(false)
    showToast(armed ? '八路防区已撤防' : '八路防区已开启')
  }
  return <main className="relative mx-auto h-[800px] w-[1280px] overflow-hidden bg-cover bg-center text-[#f7f8f9]" style={{ backgroundImage: `linear-gradient(rgba(13,20,28,.70),rgba(0,5,9,.72)),url('${assetUrl('assets/figma/raw-1.png')}')` }}>
    {page === 'home' && <><Sidebar /><TopActions armed={armed} onDefense={() => setDefenseConfirm(true)} onIntercomSimulation={() => setSimulation('intercom')} onSecuritySimulation={() => setSimulation('security')} /><HomePage onNavigate={setPage} showToast={showToast} /></>}
    {page === 'intercom' && <IntercomPage onBack={() => setPage('home')} showToast={showToast} armed={armed} onDefense={() => setDefenseConfirm(true)} />}
    {page === 'angel' && <AngelPage onBack={() => setPage('home')} armed={armed} onDefense={() => setDefenseConfirm(true)} />}
    {simulation === 'intercom' && <IncomingCallSimulation onClose={() => setSimulation(null)} showToast={showToast} />}
    {simulation === 'security' && <SecurityAlarmSimulation onClose={() => setSimulation(null)} showToast={showToast} />}
    <Toast message={toast} />
    <ConfirmDialog open={defenseConfirm} title={`确认${armed ? '撤防' : '开启'}八路防区？`} description={armed ? '撤防后，已连接的防区设备将停止触发安防报警。请确认当前住宅环境安全。' : '开启后，已连接的防区设备将恢复安防监测与报警触发。'} confirmText={`确认${armed ? '撤防' : '开启'}`} confirmTone={armed ? 'orange' : 'green'} onCancel={() => setDefenseConfirm(false)} onConfirm={toggleDefense} />
  </main>
}
