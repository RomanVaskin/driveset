import { Check } from 'lucide-react'
import { priceDisclaimer, wrappingPackages } from '@/lib/wrapping-config'

export function WrappingPackages() {
  return (
    <section id="packages" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Пакеты оклейки</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Понятные варианты защиты кузова
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {wrappingPackages.map((item) => (
            <article key={item.id} className={`relative flex flex-col rounded-2xl border p-6 shadow-soft md:p-8 ${item.featured ? 'border-champagne/50 bg-primary text-primary-foreground' : 'border-border bg-card'}`}>
              {item.featured && (
                <span className="mb-5 w-fit rounded-full border border-champagne/40 bg-champagne/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-champagne">
                  Скидка 20 000 ₽
                </span>
              )}
              <h3 className="font-display text-2xl font-bold tracking-tight">{item.title}</h3>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {item.regularPriceLabel && <span className="text-base text-muted-foreground line-through">{item.regularPriceLabel}</span>}
                <span className="font-display text-2xl font-bold text-champagne">{item.priceLabel}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <p className="mt-4 text-sm font-medium">Срок: {item.duration}</p>

              {item.items && (
                <ul className="mt-6 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground sm:grid-cols-2">
                  {item.items.map((part) => (
                    <li key={part} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden="true" />
                      {part}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{priceDisclaimer}</p>
      </div>
    </section>
  )
}
