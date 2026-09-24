import { filmBrands } from '@/lib/wrapping-config'

export function FilmsSection() {
  return (
    <section className="section-dark border-y border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Плёнки</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Выбор не по каталогу, а по реальным образцам</h2>
          </div>
          <p className="leading-relaxed text-muted-foreground">DriveSet работает с PPF Union, Wematec и STEK. Можно выбрать конкретный бренд или серию и посмотреть образцы в студии до принятия решения.</p>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {filmBrands.map((brand, index) => (
            <li key={brand} className="bg-card p-7">
              <span className="text-xs text-muted-foreground">0{index + 1}</span>
              <p className="mt-8 font-display text-2xl font-bold text-champagne">{brand}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
