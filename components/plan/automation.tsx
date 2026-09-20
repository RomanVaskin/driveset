import { Fragment } from 'react'
import {
  Bell,
  BellRing,
  Calculator,
  CalendarCheck,
  Check,
  ChevronRight,
  Database,
  Repeat2,
  Send,
  type LucideIcon,
} from 'lucide-react'
import {
  afterService,
  bookingActiveDay,
  bookingDays,
  bookingSlots,
  crmActiveStatus,
  crmFields,
  crmStatuses,
  followUpSteps,
  quizSteps,
  telegramFields,
} from '@/lib/plan-config'
import { cn } from '@/lib/utils'
import { FlowChain } from './flow-chain'
import { GroupLabel, IconBadge, PlanSection } from './plan-section'

function AutoCard({
  icon,
  title,
  hint,
  className,
  children,
}: {
  icon: LucideIcon
  title: string
  hint: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <IconBadge icon={icon} />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight">{title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-1 flex-col justify-center rounded-lg border border-border bg-background/60 p-4">{children}</div>
    </article>
  )
}

function QuizMock() {
  return (
    <ol className="space-y-3">
      {quizSteps.map((step, i) => (
        <li key={step.label} className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
              step.state === 'done' && 'border-primary bg-primary text-primary-foreground',
              step.state === 'current' && 'border-primary text-primary',
              step.state === 'pending' && 'border-border text-muted-foreground',
            )}
          >
            {step.state === 'done' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
          </span>
          <div className="min-w-0">
            <p className={cn('text-sm', step.state === 'pending' ? 'text-muted-foreground' : 'text-foreground')}>
              {step.label}
            </p>
            {'hint' in step && <p className="mt-0.5 text-xs font-medium text-primary">{step.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

function TelegramMock() {
  return (
    <div className="rounded-2xl rounded-tl-sm border border-border bg-secondary/60 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
        Новая заявка
      </p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {telegramFields.map(([key, value]) => (
          <Fragment key={key}>
            <dt className="text-muted-foreground">{key}</dt>
            <dd className="min-w-0 [overflow-wrap:anywhere]">{value}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  )
}

function BookingMock() {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Услуга</span>
        <span className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          Полировка
        </span>
      </div>
      <div>
        <p className="text-muted-foreground">Дата</p>
        <ul className="mt-2 grid grid-cols-5 gap-1.5">
          {bookingDays.map((day) => (
            <li
              key={day}
              className={cn(
                'rounded-md border py-1.5 text-center text-xs',
                day === bookingActiveDay
                  ? 'border-primary bg-primary text-primary-foreground font-semibold'
                  : 'border-border text-muted-foreground',
              )}
            >
              {day}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-muted-foreground">Время</p>
        <ul className="mt-2 grid grid-cols-4 gap-1.5">
          {bookingSlots.map((slot) => (
            <li
              key={slot.time}
              className={cn(
                'rounded-md border py-1.5 text-center text-xs tabular-nums',
                'active' in slot && slot.active
                  ? 'border-primary bg-primary text-primary-foreground font-semibold'
                  : 'busy' in slot && slot.busy
                    ? 'border-border text-muted-foreground/50 line-through'
                    : 'border-border text-foreground',
              )}
            >
              {slot.time}
            </li>
          ))}
        </ul>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Свободный слот сразу попадает в CRM
      </p>
    </div>
  )
}

function CrmMock() {
  return (
    <div className="space-y-4">
      <ol aria-label="Статусы заявки" className="flex flex-wrap items-center gap-1.5 text-xs">
        {crmStatuses.map((status, i) => (
          <li key={status} className="flex items-center gap-1.5">
            <span
              className={cn(
                'rounded-full border px-3 py-1',
                status === crmActiveStatus
                  ? 'border-primary/50 bg-primary/10 font-medium text-primary'
                  : 'border-border text-muted-foreground',
              )}
            >
              {status}
            </span>
            {i < crmStatuses.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {crmFields.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
          >
            <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FollowUpMock() {
  return (
    <ol className="space-y-4">
      {followUpSteps.map((step, i) => {
        const Icon = step.icon
        const isLast = i === followUpSteps.length - 1
        return (
          <li key={step.label} className="relative flex items-start gap-3">
            {!isLast && (
              <span aria-hidden="true" className="absolute left-4 top-9 -bottom-4 w-px bg-border" />
            )}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-sm leading-snug">{step.label}</p>
              {'tag' in step && (
                <span className="mt-1.5 inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {step.tag}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function Automation() {
  return (
    <PlanSection
      id="automation"
      tinted
      eyebrow="Автоматизация"
      title="Ни одна заявка не теряется"
      lead="Процессы идут в порядке пути клиента: до записи, во время ведения и после услуги. Всё стекается в CRM."
    >
      <div className="space-y-10">
        <div>
          <GroupLabel>До записи</GroupLabel>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AutoCard icon={Calculator} title="Квиз / калькулятор" hint="Считает ориентир и забирает контакт">
              <QuizMock />
            </AutoCard>
            <AutoCard icon={Send} title="Telegram-уведомления" hint="Менеджер видит заявку сразу">
              <TelegramMock />
            </AutoCard>
            <AutoCard
              icon={CalendarCheck}
              title="Онлайн-запись"
              hint="Клиент сам выбирает удобное окно"
              className="sm:col-span-2 lg:col-span-1"
            >
              <BookingMock />
            </AutoCard>
          </div>
        </div>

        <div>
          <GroupLabel>Ведение клиента</GroupLabel>
          <div className="grid gap-5 lg:grid-cols-3">
            <AutoCard
              icon={Database}
              title="CRM"
              hint="Клиент, автомобиль и вся история в одном месте"
              className="lg:col-span-2"
            >
              <CrmMock />
            </AutoCard>
            <AutoCard icon={BellRing} title="Follow-up" hint="Возвращает тех, кто получил расчёт и пропал">
              <FollowUpMock />
            </AutoCard>
          </div>
        </div>

        <div>
          <GroupLabel>После услуги</GroupLabel>
          <article className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
            <div className="flex items-center gap-3">
              <IconBadge icon={Repeat2} />
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold leading-tight tracking-tight">
                  Отзывы и повторные продажи
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Запускаются автоматически после выдачи автомобиля
                </p>
              </div>
            </div>
            <FlowChain steps={afterService} label="Что происходит после услуги" inset from="md" className="mt-5" />
          </article>
        </div>
      </div>
    </PlanSection>
  )
}
