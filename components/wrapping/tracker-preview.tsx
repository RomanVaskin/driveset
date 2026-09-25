import { wrappingTrackerPreview } from '@/lib/wrapping-config'

const markers = { complete: '✓', current: '●', upcoming: '○' } as const

export function WrappingTrackerPreview() {
  const preview = wrappingTrackerPreview

  return (
    <section className="section-dark border-y border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_0.9fr] md:items-center md:gap-12 md:py-20 lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Контроль работ</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">{preview.title}</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{preview.description}</p>
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-champagne">Пример персонального трекера</p>
          <div className="mt-5 border-b border-border pb-5">
            <h3 className="font-display text-xl font-bold">{preview.car}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{preview.order}</p>
            <p className="mt-2 text-sm font-medium">{preview.service}</p>
          </div>

          <ol className="mt-5 space-y-3">
            {preview.stages.map((stage) => (
              <li key={stage.title} aria-current={stage.status === 'current' ? 'step' : undefined} className={`flex items-center gap-3 text-sm ${stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center font-bold ${stage.status === 'upcoming' ? 'text-muted-foreground' : 'text-champagne'}`}>{markers[stage.status]}</span>
                <span className={stage.status === 'current' ? 'font-semibold' : undefined}>{stage.title}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-xs text-muted-foreground">Ориентировочная готовность:</p>
            <p className="mt-1 font-display text-lg font-bold text-champagne">{preview.readyAt}</p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{preview.caption}</p>
        </div>
      </div>
    </section>
  )
}
