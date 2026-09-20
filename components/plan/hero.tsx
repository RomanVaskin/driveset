import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { journey, planHero } from '@/lib/plan-config'
import { FlowChain } from './flow-chain'

export function PlanHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-detailing.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/75 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/20" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:pb-24 md:pt-24 lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            Стратегия • внутренний документ
          </p>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            {planHero.title}
          </h1>

          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg font-medium text-foreground/90 sm:text-xl md:text-2xl">
            {planHero.subtitle.map((part, i) => (
              <span key={part} className="inline-flex items-center gap-3">
                {part}
                {i < planHero.subtitle.length - 1 && (
                  <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                )}
              </span>
            ))}
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
            {planHero.lead}
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-background/60 p-4 backdrop-blur-md md:mt-16 md:p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Путь клиента
          </p>
          <FlowChain steps={journey} label="Путь клиента" />
        </div>
      </div>
    </section>
  )
}
