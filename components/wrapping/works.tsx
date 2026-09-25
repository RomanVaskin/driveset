import { WrappingWorksClient } from './works-client'

export function WrappingWorks() {
  return (
    <section id="works" className="section-dark scroll-mt-20 border-y border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Реальные работы</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Автомобили, которые мы уже защитили</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Посмотрите наши работы по оклейке автомобилей.</p>
        </div>
        <WrappingWorksClient />
      </div>
    </section>
  )
}
