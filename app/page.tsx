import { Header } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { Services } from '@/components/site/services'
import { WhyUs } from '@/components/site/why-us'
import { Process } from '@/components/site/process'
import { Gallery } from '@/components/site/gallery'
import { CtaBand } from '@/components/site/cta'
import { Contacts } from '@/components/site/contacts'
import { Footer } from '@/components/site/footer'
import { site } from '@/lib/site-config'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDetailing',
  name: site.name,
  description: site.description,
  url: site.url,
  areaServed: site.city,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'улица Наташи Ковшовой, 4с2',
    addressLocality: 'Москва',
    addressCountry: 'RU',
  },
  telephone: site.phone,
  openingHours: 'Mo-Su 10:00-22:00',
  makesOffer: ['Оклейка автомобиля', 'Полировка кузова', 'Химчистка автомобиля'],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Process />
        <Gallery />
        <CtaBand />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
