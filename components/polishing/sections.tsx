import Link from 'next/link'
import { CardGrid, LandingContacts, LandingHero, PriceList } from '@/components/landing/sections'
import {
  polishingDepthNote,
  polishingProblems,
  polishingTypes,
  polishingTypesNote,
  polishingExtraServices,
  polishingPriceNote,
  polishingPrices,
} from '@/lib/polishing-config'

export function PolishingHero() {
  return (
    <LandingHero
      title="Полировка кузова и фар автомобиля в Москве"
      subtitle="Вернём кузову блеск и глубину цвета, уберём мелкие царапины и следы эксплуатации, отполируем фары."
      image="/images/service-polishing.webp"
      imageAlt="Полировка кузова автомобиля в DriveSet"
    />
  )
}

export function PolishingProblems() {
  return <CardGrid id="problems" eyebrow="Что решает полировка" title="Когда кузову нужна полировка" items={polishingProblems} note={polishingDepthNote} />
}

export function PolishingTypes() {
  return <CardGrid id="types" eyebrow="Виды работ" title="Виды полировки кузова и фар" items={polishingTypes} note={polishingTypesNote} />
}

export function PolishingPrices() {
  return <PriceList title="Стоимость полировки" items={polishingPrices} note={polishingPriceNote} extras={polishingExtraServices} />
}

/** Related service: protecting the bumper, headlights and other elements is the wrapping page's offer (confirmed in its FAQ). */
export function PolishingRelated() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Нужна защита бампера, фар или других элементов кузова? В DriveSet есть{' '}
        <Link href="/okleyka-avto" className="font-semibold text-foreground underline underline-offset-4 hover:text-champagne">
          оклейка защитной плёнкой
        </Link>
        .
      </p>
    </section>
  )
}

export const PolishingContacts = LandingContacts
