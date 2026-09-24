import { ArrowDown, Camera, Check, MapPin } from 'lucide-react'
import { site } from '@/lib/site-config'
import { WrappingHeroMedia } from './works-client'

const heroFacts = ['5 лет опыта', '41 отзыв', 'Рейтинг 5.0', 'Гарантия 3 года'] as const

export function WrappingHero() {
  return (
    <section id="top" className="section-dark overflow-hidden border-b border-border">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-5 py-14 md:min-h-[720px] md:grid-cols-[1.05fr_0.95fr] md:py-20 lg:px-8">
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/75">
            <MapPin className="size-3.5 text-champagne" aria-hidden="true" />
            {site.city} · {site.addressShort}
          </p>
          <h1 className="mt-6 font-display text-[2.45rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
            Оклейка автомобиля полиуретановой плёнкой в Москве
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            Защитите кузов от сколов, царапин и реагентов
          </p>

          <div className="mt-7 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
            <div className="bg-card p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Передняя часть</p>
              <p className="mt-2 font-display text-xl font-bold text-champagne sm:text-2xl">от 85 000 ₽</p>
            </div>
            <div className="bg-card p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Полный кузов PPF</p>
              <p className="mt-2 font-display text-xl font-bold text-champagne sm:text-2xl">от 190 000 ₽</p>
              <p className="mt-1 text-xs text-muted-foreground">по акции</p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#calculator" className="inline-flex items-center justify-center rounded-md bg-champagne px-6 py-3.5 font-semibold text-graphite transition-opacity hover:opacity-90">
              Рассчитать стоимость
              <ArrowDown className="ml-2 size-4" aria-hidden="true" />
            </a>
            <a href="#photo-calc" className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
              <Camera className="mr-2 size-4" aria-hidden="true" />
              Рассчитать по фото
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-white/65">
            {heroFacts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-champagne" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <WrappingHeroMedia />
      </div>
    </section>
  )
}
