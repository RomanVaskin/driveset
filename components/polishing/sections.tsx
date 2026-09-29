import { CardGrid, LandingContacts, LandingHero, PriceList } from '@/components/landing/sections'
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
  return <PriceList title="Стоимость полировки" items={polishingPrices} note={polishingPriceNote} extras={polishingExtraServices} />
}

export const PolishingContacts = LandingContacts
