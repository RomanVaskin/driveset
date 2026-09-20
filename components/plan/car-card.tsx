import Image from 'next/image'
import { CalendarClock, History, Users } from 'lucide-react'
import { carCard } from '@/lib/plan-config'
import { IconBadge, PlanSection } from './plan-section'

const benefitIcons = [Users, History, CalendarClock] as const

export function CarCardSection() {
  return (
    <PlanSection
      id="car"
      eyebrow="Карточка автомобиля"
      title="Автомобиль — отдельная сущность в CRM"
      lead="Клиент может сменить телефон или привести вторую машину. История работ должна остаться с автомобилем."
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="border-l-2 border-primary pl-5 font-display text-xl font-semibold leading-snug text-balance md:text-2xl">
            {carCard.idea}
          </p>
          <ul className="mt-8 space-y-4">
            {carCard.benefits.map((benefit, i) => (
              <li key={benefit} className="flex items-center gap-4">
                <IconBadge icon={benefitIcons[i]} />
                <span className="text-sm leading-snug text-muted-foreground md:text-base">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* UI-мокап карточки автомобиля */}
        <article
          aria-label="Пример карточки автомобиля в CRM"
          className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card lg:mr-0 lg:ml-auto"
        >
          <div className="relative h-40">
            <Image
              src="/images/work-4.png"
              alt="Иллюстрация к примеру карточки автомобиля"
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover object-[50%_40%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
              Пример карточки
            </span>
          </div>

          <div className="p-6 pt-2">
            <h3 className="font-display text-2xl font-extrabold tracking-tight">{carCard.model}</h3>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/60 px-4 py-3">
                <dt className="text-xs text-muted-foreground">Клиент</dt>
                <dd className="mt-0.5 font-medium">{carCard.client}</dd>
              </div>
              <div className="rounded-lg border border-border bg-background/60 px-4 py-3">
                <dt className="text-xs text-muted-foreground">Пробег</dt>
                <dd className="mt-0.5 font-medium tabular-nums">{carCard.mileage}</dd>
              </div>
            </dl>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              История
            </p>
            <ol className="mt-3 space-y-2.5">
              {carCard.history.map((entry) => (
                <li key={entry.work} className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span className="w-11 shrink-0 font-medium tabular-nums text-primary">{entry.date}</span>
                  <span>{entry.work}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Следующий контакт</p>
                <p className="mt-0.5 text-sm font-semibold">
                  {carCard.next.when} — {carCard.next.what}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </PlanSection>
  )
}
