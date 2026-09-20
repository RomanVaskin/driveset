import { Flag } from 'lucide-react'
import { stages } from '@/lib/plan-config'
import { PlanSection } from './plan-section'

export function Roadmap() {
  return (
    <PlanSection
      id="roadmap"
      eyebrow="Этапы внедрения"
      title="Пять этапов — от основы до возврата клиентов"
      lead="Следующий этап стартует, когда выполнен критерий готовности предыдущего. Так не запускаем рекламу, пока не видим, куда попадают заявки."
    >
      <ol className="grid gap-0 lg:grid-cols-5 lg:gap-x-4">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1
          return (
            <li key={stage.name} className="relative flex flex-col pb-8 pl-14 last:pb-0 lg:pb-0 lg:pl-0 lg:pt-14">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-background font-display text-sm font-bold text-primary"
              >
                {i + 1}
              </span>
              {!isLast && (
                <>
                  <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px bg-border lg:hidden" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 left-12 top-5 hidden h-px bg-border lg:block"
                  />
                </>
              )}

              <div className="flex flex-1 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Этап {i + 1}</p>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">{stage.name}</h3>
                <ul className="mb-5 mt-4 flex flex-wrap gap-1.5">
                  {stage.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-border bg-secondary/60 px-2.5 py-1 text-xs leading-snug text-foreground/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-border pt-4">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Flag className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Готово, когда
                  </p>
                  <p className="mt-1.5 text-sm leading-snug">{stage.done}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </PlanSection>
  )
}
