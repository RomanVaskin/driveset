import { wrappingProcess } from '@/lib/wrapping-config'

export function WrappingProcess() {
  return (
    <section id="process" className="section-dark scroll-mt-20 border-y border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Процесс</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">От бесплатного осмотра до обязательной коррекции</h2>
        </div>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {wrappingProcess.map((item, index) => (
            <li key={item.title} className={`bg-card p-6 md:p-8 ${index === wrappingProcess.length - 1 ? 'md:col-span-2' : ''}`}>
              <span className="text-xs font-semibold text-champagne">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
