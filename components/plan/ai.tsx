import Image from 'next/image'
import {
  BotMessageSquare,
  Check,
  Clapperboard,
  FileText,
  Link2,
  MessageCircle,
  Newspaper,
  ScanSearch,
  Search,
  ShieldCheck,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react'
import { aiContentOutputs, carCard, polishingPrice } from '@/lib/plan-config'
import { IconBadge, PlanSection } from './plan-section'

function AiCard({
  icon,
  title,
  description,
  guard,
  guardIcon: GuardIcon = ShieldCheck,
  visual,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  /** Короткая оговорка: где AI останавливается и решение за человеком. */
  guard: string
  guardIcon?: LucideIcon
  visual: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <div className="relative flex min-h-60 flex-col border-b border-border bg-background/60">{visual}</div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <IconBadge icon={icon} />
          <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
        {children}
        <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-snug text-muted-foreground">
          <GuardIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          {guard}
        </p>
      </div>
    </article>
  )
}

const outputIcons: Record<(typeof aiContentOutputs)[number], LucideIcon> = {
  Пост: Newspaper,
  'Описание кейса': FileText,
  'Reels caption': Clapperboard,
  'SEO-текст': Search,
}

function ConsultantVisual() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3 p-5">
      <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm border border-border bg-secondary px-4 py-2.5 text-sm">
        Сколько стоит полировка кузова?
      </p>
      <p className="max-w-[88%] rounded-2xl rounded-bl-sm border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm leading-relaxed">
        Ориентир — {polishingPrice}. Оставьте контакт, менеджер уточнит стоимость после осмотра.
      </p>
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Лид передан в CRM
      </p>
    </div>
  )
}

function PhotoVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/images/service-polishing.png"
        alt="Фото кузова, которое клиент отправляет на анализ"
        fill
        sizes="(max-width: 768px) 100vw, 534px"
        className="object-cover object-[50%_45%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
      <div
        aria-hidden="true"
        className="absolute left-[14%] top-[24%] h-[52%] w-[42%] rounded-md border-2 border-dashed border-primary/80"
      >
        <span className="absolute -top-3 left-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
          Зона: ЛКП двери
        </span>
      </div>
      <p className="absolute bottom-4 left-4 right-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
        <ScanSearch className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Предварительно: полировка
      </p>
    </div>
  )
}

function ContentVisual() {
  return (
    <div className="grid flex-1 grid-cols-2 gap-3 p-4">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src="/images/work-3.png"
          alt="Фото выполненной работы — исходник для AI-контента"
          fill
          sizes="(max-width: 768px) 50vw, 260px"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          Фото работы
        </span>
      </div>
      <ul className="flex flex-col justify-center gap-2">
        {aiContentOutputs.map((output) => {
          const Icon = outputIcons[output]
          return (
            <li
              key={output}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-xs sm:text-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {output}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function FollowUpVisual() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Сообщение клиенту · черновик AI
      </p>
      <p className="rounded-2xl rounded-tl-sm border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-relaxed">
        {carCard.client}, вы считали полировку для {carCard.model}. На этой неделе есть свободные окна — записать вас?
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {['Знает авто', 'Знает услугу', 'Знает историю'].map((chip) => (
          <li key={chip} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
            {chip}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AiSection() {
  return (
    <PlanSection
      id="ai"
      tinted
      eyebrow="AI"
      title="AI работает поверх данных CRM"
      lead="AI подключаем после CRM: ему нужны карточки клиентов и автомобилей. Он готовит и предлагает — решение остаётся за человеком."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <AiCard
          icon={BotMessageSquare}
          title="AI-консультант"
          description="Отвечает на вопросы и собирает лид."
          guard="Если нужен человек — передаёт диалог менеджеру."
          visual={<ConsultantVisual />}
        />
        <AiCard
          icon={ScanSearch}
          title="AI-анализ фото"
          description="Клиент отправляет фото кузова или салона. AI предварительно определяет подходящую услугу."
          guard="Оценка предварительная — стоимость подтверждается после осмотра."
          visual={<PhotoVisual />}
        />
        <AiCard
          icon={WandSparkles}
          title="AI-контент"
          description="Из фото выполненной работы автоматически создаются пост, описание кейса, Reels caption и SEO-текст."
          guard="Публикует человек после проверки."
          visual={<ContentVisual />}
        />
        <AiCard
          icon={MessageCircle}
          title="AI-follow-up"
          description="AI помогает возвращать клиентов, которые не записались."
          guard="Развитие Follow-up из блока автоматизации: тот же сценарий, но текст пишется под конкретного клиента."
          guardIcon={Link2}
          visual={<FollowUpVisual />}
        />
      </div>
    </PlanSection>
  )
}
