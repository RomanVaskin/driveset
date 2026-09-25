import type { Metadata } from 'next'
import { WrappingBenefits } from '@/components/wrapping/benefits'
import { ElementPrices } from '@/components/wrapping/element-prices'
import { WrappingFaq } from '@/components/wrapping/faq'
import { FilmsSection } from '@/components/wrapping/films'
import { WrappingFinalCta } from '@/components/wrapping/final-cta'
import { WrappingFooter } from '@/components/wrapping/footer'
import { WrappingHeader } from '@/components/wrapping/header'
import { WrappingHero } from '@/components/wrapping/hero'
import { NewCarSection } from '@/components/wrapping/new-car'
import { WrappingPackages } from '@/components/wrapping/packages'
import { WrappingProcess } from '@/components/wrapping/process'
import { WrappingPromotion } from '@/components/wrapping/promotion'
import { WrappingQuiz } from '@/components/wrapping/quiz'
import { WrappingReviews } from '@/components/wrapping/reviews'
import { WrappingTrackerPreview } from '@/components/wrapping/tracker-preview'
import { WrappingWorks } from '@/components/wrapping/works'
import { site } from '@/lib/site-config'
import { faqItems } from '@/lib/wrapping-config'

const title = 'Оклейка автомобиля полиуретановой плёнкой в Москве'
const description = 'Оклейка автомобиля защитной PPF-плёнкой в DriveSet. Передняя часть от 85 000 ₽, полный кузов PPF от 190 000 ₽ по акции. Бесплатный осмотр.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/okleyka-avto' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/okleyka-avto',
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
      name: title,
      description,
      url: `${site.url}/okleyka-avto`,
      areaServed: site.city,
      serviceType: 'Оклейка автомобиля полиуретановой плёнкой',
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
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function WrappingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <WrappingHeader />
      <main>
        <WrappingHero />
        <WrappingPackages />
        <WrappingPromotion />
        <WrappingQuiz />
        <WrappingWorks />
        <NewCarSection />
        <FilmsSection />
        <WrappingBenefits />
        <WrappingTrackerPreview />
        <WrappingProcess />
        <ElementPrices />
        <WrappingReviews />
        <WrappingFaq />
        <WrappingFinalCta />
      </main>
      <WrappingFooter />
    </>
  )
}
