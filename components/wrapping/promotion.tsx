import { BadgePercent } from 'lucide-react'
import { promotionDeadlineLabel } from '@/lib/wrapping-config'

export function WrappingPromotion() {
  return (
    <section className="px-5 pb-20 md:pb-28 lg:px-8">
      <div className="section-dark mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl border border-border p-7 shadow-card sm:p-10 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-3xl items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-champagne text-graphite">
            <BadgePercent className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-champagne">Акция на полный кузов PPF</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-4xl">
              <span className="text-muted-foreground line-through">от 210 000 ₽</span>{' '}
              <span className="text-champagne">→ от 190 000 ₽ по акции</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Скидка 20 000 ₽ действует только на полную оклейку прозрачной PPF-плёнкой.
            </p>
            <p className="mt-2 text-sm font-semibold text-champagne">{promotionDeadlineLabel}</p>
          </div>
        </div>
        <a href="#calculator" className="inline-flex shrink-0 items-center justify-center rounded-md bg-champagne px-6 py-3.5 font-semibold text-graphite">
          Получить расчёт
        </a>
      </div>
    </section>
  )
}
