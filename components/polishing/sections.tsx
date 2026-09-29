import { CardGrid, LandingContacts, LandingHero } from '@/components/landing/sections'
import {
  polishingDepthNote,
  polishingProblems,
  polishingExtraServices,
  polishingPriceNote,
  polishingPrices,
} from '@/lib/polishing-config'

export function PolishingHero() {
  return (
    <LandingHero
      title="Полировка автомобиля в Москве"
      subtitle="Вернём кузову блеск и глубину цвета, уберём мелкие царапины и следы эксплуатации."
      image="/images/service-polishing.webp"
      imageAlt="Полировка кузова автомобиля в DriveSet"
    />
  )
}

export function PolishingProblems() {
  return <CardGrid id="problems" eyebrow="Что решает полировка" title="Когда кузову нужна полировка" items={polishingProblems} note={polishingDepthNote} />
}

export function PolishingPrices() {
  return (
    <section id="prices" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Варианты и цены</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Стоимость полировки</h2>
      </div>
      <dl className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {polishingPrices.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5">
            <dt className="font-medium">{item.title}</dt>
            <dd className="shrink-0 font-display text-lg font-bold text-champagne">{item.priceLabel}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{polishingPriceNote}</p>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed">
        <span className="font-semibold">Также выполняем:</span>{' '}
        <span className="text-muted-foreground">{polishingExtraServices.join(' · ')} — стоимость рассчитаем индивидуально.</span>
      </p>
    </section>
  )
}

export const PolishingContacts = LandingContacts
