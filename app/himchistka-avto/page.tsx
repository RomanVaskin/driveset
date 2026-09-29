import type { Metadata } from 'next'
import { CleaningQuiz } from '@/components/cleaning/quiz'
import { PortfolioWorks } from '@/components/landing/portfolio-works'
import { CardGrid, LandingContacts, LandingHero, TrustStrip } from '@/components/landing/sections'
import { WrappingBenefits } from '@/components/wrapping/benefits'
import { WrappingFaq } from '@/components/wrapping/faq'
import { WrappingFinalCta } from '@/components/wrapping/final-cta'
import { WrappingFooter } from '@/components/wrapping/footer'
import { WrappingHeader } from '@/components/wrapping/header'
import { WrappingProcess } from '@/components/wrapping/process'
import { cleaningBenefits, cleaningFaq, cleaningNav, cleaningProcess, cleaningZones, cleaningZonesNote } from '@/lib/cleaning-config'
import { site } from '@/lib/site-config'

const title = 'Химчистка салона автомобиля в Москве'
const description = 'Химчистка салона автомобиля в DriveSet, Москва: удалим загрязнения, пятна и неприятные запахи. Сиденья, потолок, пол, багажник. Запись без предоплаты.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/himchistka-avto' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/himchistka-avto',
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
      url: `${site.url}/himchistka-avto`,
      areaServed: site.city,
      serviceType: 'Химчистка салона автомобиля',
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
      mainEntity: cleaningFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function CleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <WrappingHeader nav={cleaningNav} pageLabel="химчистки" />
      <main>
        <LandingHero
          title="Химчистка салона автомобиля в Москве"
          subtitle="Удалим загрязнения, пятна и неприятные запахи. Вернём салону чистый и ухоженный вид."
          image="/images/service-cleaning.webp"
          imageAlt="Химчистка сиденья автомобиля в DriveSet"
        />
        <CleaningQuiz />
        <TrustStrip />
        <CardGrid id="zones" eyebrow="Что входит" title="Что можно очистить" items={cleaningZones} note={cleaningZonesNote} />
        <PortfolioWorks category="dry-cleaning" description="Фото и видео салонов после химчистки в DriveSet." itemLabel="химчистке" />
        <WrappingProcess steps={cleaningProcess} title="Как проходит химчистка" />
        <WrappingBenefits items={cleaningBenefits} title="Удобно записаться и забрать автомобиль" />
        <WrappingFaq items={cleaningFaq} />
        <LandingContacts />
        <WrappingFinalCta title="Рассчитайте стоимость химчистки салона" text="Стоимость зависит от автомобиля, объёма работ и состояния салона — оставьте заявку, и мы её рассчитаем." />
      </main>
      <WrappingFooter links={[{ label: 'Расчёт', href: '#calculator' }, { label: 'Работы', href: '#works' }, { label: 'Контакты', href: '#contacts' }]} />
    </>
  )
}
