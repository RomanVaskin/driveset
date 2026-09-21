import { processSteps } from '@/lib/site-config'

export function Process() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Процесс</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
          Как мы работаем
        </h2>
      </div>

      <ol className="mt-12 grid gap-y-8 md:grid-cols-5 md:gap-x-4">
        {processSteps.map((step, i) => (
          <li key={step.step} className="relative flex gap-4 md:flex-col md:gap-3">
            <div className="flex flex-col items-center md:flex-row md:items-center md:gap-3">
              <span className="font-display text-sm font-semibold tabular-nums text-champagne">
                {step.step}
              </span>
              <span className="mt-2 hidden h-px flex-1 bg-border md:mt-0 md:block" aria-hidden="true" />
            </div>
            <div className="pb-1">
              <h3 className="font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
