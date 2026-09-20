import type { Metadata } from 'next'
import { AiSection } from '@/components/plan/ai'
import { Automation } from '@/components/plan/automation'
import { CarCardSection } from '@/components/plan/car-card'
import { FinalChain } from '@/components/plan/final-chain'
import { PlanFooter } from '@/components/plan/footer'
import { PlanHeader } from '@/components/plan/header'
import { PlanHero } from '@/components/plan/hero'
import { KpiSection } from '@/components/plan/kpi'
import { Promotion } from '@/components/plan/promotion'
import { Roadmap } from '@/components/plan/roadmap'

const description =
  'Внутренний план развития DriveSet: продвижение, автоматизация, AI и этапы внедрения.'

/**
 * Внутренняя стратегическая страница: закрыта от индексации и не входит в sitemap.
 * Canonical переопределяем, иначе он унаследуется от layout и укажет на главную.
 */
export const metadata: Metadata = {
  title: 'План развития',
  description,
  alternates: { canonical: '/plan' },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/plan',
    siteName: 'DriveSet',
    title: 'План развития DriveSet',
    description,
  },
}

export default function PlanPage() {
  return (
    <>
      <PlanHeader />
      <main>
        <PlanHero />
        <Promotion />
        <Automation />
        <CarCardSection />
        <AiSection />
        <Roadmap />
        <KpiSection />
        <FinalChain />
      </main>
      <PlanFooter />
    </>
  )
}
