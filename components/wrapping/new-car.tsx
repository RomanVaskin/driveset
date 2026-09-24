import { ShieldCheck } from 'lucide-react'

export function NewCarSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
      <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-card md:grid-cols-[0.85fr_1.15fr]">
        <div className="section-dark flex min-h-64 items-center justify-center p-10">
          <ShieldCheck className="size-24 text-champagne" strokeWidth={1} aria-hidden="true" />
        </div>
        <div className="p-7 sm:p-10 md:p-14">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Для нового автомобиля</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Защитите новый автомобиль до первого скола</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">Особенно актуально для популярных новых китайских автомобилей, но мы работаем с автомобилями любых марок. Бесплатно осмотрим кузов и подберём подходящий объём защиты.</p>
          <a href="#calculator" className="mt-7 inline-flex rounded-md bg-primary px-6 py-3.5 font-semibold text-primary-foreground">Рассчитать для моего автомобиля</a>
        </div>
      </div>
    </section>
  )
}
