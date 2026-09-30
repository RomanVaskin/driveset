import { elementPrices } from '@/lib/wrapping-config'

export function ElementPrices() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Отдельные элементы</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Защитите только нужную зону</h2>
        </div>
        <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {elementPrices.map((item) => (
            <li key={item.id} className="border-b border-border px-5 py-4 font-medium last:border-b-0 sm:px-6">{item.title}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
