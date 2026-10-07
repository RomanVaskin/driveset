import type { Metadata } from 'next'
import { PolishingQuiz } from '@/components/polishing/quiz'
import { PolishingContacts, PolishingHero, PolishingPrices, PolishingProblems, PolishingRelated, PolishingTypes } from '@/components/polishing/sections'
import { PortfolioWorks } from '@/components/landing/portfolio-works'
import { WrappingBenefits } from '@/components/wrapping/benefits'
import { WrappingFaq } from '@/components/wrapping/faq'
import { WrappingFinalCta } from '@/components/wrapping/final-cta'
import { WrappingFooter } from '@/components/wrapping/footer'
import { WrappingHeader } from '@/components/wrapping/header'
import { WrappingProcess } from '@/components/wrapping/process'
import { polishingBenefits, polishingFaq, polishingNav, polishingProcess } from '@/lib/polishing-config'
import { site } from '@/lib/site-config'

const title = 'Полировка кузова и фар в Москве: цены'
const description = 'Полировка кузова и фар автомобиля в DriveSet, Москва: лёгкая, восстановительная и глубокая абразивная полировка, полировка элемента. Цены от 2 500 ₽, бесплатный осмотр, запись без предоплаты.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/polirovka-avto' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/polirovka-avto',
    siteName: site.name,
    title: `${title} — ${site.name}`,
    description,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Полировка кузова и фар автомобиля в Москве',
      description,
      url: `${site.url}/polirovka-avto`,
      areaServed: site.city,
      serviceType: 'Полировка кузова и фар автомобиля',
      provider: {
        '@type': 'AutoDetailing',
        name: site.name,
        telephone: site.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'улица Наташи Ковшовой, 4с2',
          addressLocality: 'Москва',
          addressCountry: 'RU',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: polishingFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function PolishingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <WrappingHeader nav={polishingNav} pageLabel="полировки" />
      <main>
        <PolishingHero />
        <PolishingQuiz />
        <PolishingProblems />
        <PolishingTypes />
        <PortfolioWorks category="polishing" description="Фото и видео автомобилей после полировки в DriveSet." itemLabel="полировке" />
        <PolishingPrices />
        <PolishingRelated />
        <WrappingProcess steps={polishingProcess} title="Как проходит работа" />
        <WrappingBenefits items={polishingBenefits} title="Почему выбирают DriveSet" />
        <WrappingFaq items={polishingFaq} />
        <PolishingContacts />
        <WrappingFinalCta title="Рассчитайте стоимость полировки вашего автомобиля" text="Стоимость зависит от автомобиля, состояния ЛКП и выбранных работ — оставьте заявку, и мы её рассчитаем." />
      </main>
      <WrappingFooter links={[{ label: 'Расчёт', href: '#calculator' }, { label: 'Работы', href: '#works' }, { label: 'Контакты', href: '#contacts' }]} />
    </>
  )
}
