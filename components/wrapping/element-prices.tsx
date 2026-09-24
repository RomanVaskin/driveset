import { elementPrices, priceDisclaimer } from '@/lib/wrapping-config'

export function ElementPrices() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Отдельные элементы</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Защитите только нужную зону</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{priceDisclaimer}</p>
        </div>
        <dl className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {elementPrices.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0 sm:px-6">
              <dt className="font-medium">{item.title}</dt>
              <dd className="shrink-0 font-display font-bold text-champagne">{item.priceLabel}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
