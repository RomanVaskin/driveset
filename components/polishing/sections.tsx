import Image from 'next/image'
import { ArrowDown, Clock, MapPin } from 'lucide-react'
import { PhotoCalcLink, ContactActions } from '@/components/wrapping/contact-actions'
import { site } from '@/lib/site-config'
import {
  polishingDepthNote,
  polishingProblems,
  polishingExtraServices,
  polishingPriceNote,
  polishingPrices,
} from '@/lib/polishing-config'

export function PolishingHero() {
  return (
    <section id="top" className="section-dark overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">DriveSet · {site.city}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-balance text-white md:text-6xl">Полировка автомобиля в Москве</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            Вернём кузову блеск и глубину цвета, уберём мелкие царапины и следы эксплуатации.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" className="inline-flex items-center justify-center rounded-md bg-champagne px-6 py-3.5 font-semibold text-graphite transition-opacity hover:opacity-90">
              Рассчитать стоимость
              <ArrowDown className="ml-2 size-4" aria-hidden="true" />
            </a>
            <PhotoCalcLink />
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <MapPin className="size-4 shrink-0 text-champagne" aria-hidden="true" />
            {site.addressShort}
          </p>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 md:aspect-[4/5]">
          <Image src="/images/service-polishing.webp" alt="Полировка кузова автомобиля в DriveSet" fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
        </div>
      </div>
    </section>
  )
}

export function PolishingProblems() {
  return (
    <section id="problems" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Что решает полировка</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Когда кузову нужна полировка</h2>
      </div>
      <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {polishingProblems.map((item) => (
          <li key={item.title} className="bg-card p-6">
            <h3 className="font-display text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{polishingDepthNote}</p>
    </section>
  )
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

export function PolishingContacts() {
  return (
    <section id="contacts" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Контакты</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">{site.name} в Москве</h2>
          <address className="mt-8 grid gap-4 not-italic">
            <p className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden="true" />{site.address}</p>
            <p className="flex items-start gap-3"><Clock className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden="true" />{site.workHours}</p>
          </address>
          <a href={`https://yandex.ru/maps/?text=${encodeURIComponent(site.address)}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-semibold text-foreground underline underline-offset-4 hover:text-champagne">
            Открыть в Яндекс Картах
          </a>
        </div>
        <ContactActions />
      </div>
    </section>
  )
}
