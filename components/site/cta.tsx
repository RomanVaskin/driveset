import { site } from '@/lib/site-config'

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
      <div className="section-dark flex flex-col items-start gap-8 rounded-2xl border border-border p-8 shadow-card md:flex-row md:items-center md:justify-between md:p-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Расскажите, что нужно вашему автомобилю
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Уточним задачу, оценим объём работ и рассчитаем стоимость до визита.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Телефон: <a href={site.phoneHref} className="text-foreground hover:text-champagne">{site.phone}</a>
          </p>
        </div>
        <a
          href="#lead"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-champagne px-8 py-4 text-base font-semibold text-graphite transition-opacity hover:opacity-90"
        >
          Рассчитать стоимость
        </a>
      </div>
    </section>
  )
}
