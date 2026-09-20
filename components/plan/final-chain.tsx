import { ChevronDown, ChevronRight, Undo2 } from 'lucide-react'
import { systemCaption, systemLayers, systemLoop, systemStages } from '@/lib/plan-config'
import { IconBadge, PlanSection } from './plan-section'

/**
 * Итоговая схема. CRM и AI — не шаги в цепочке, а слои под всеми этапами:
 * CRM пишет каждый шаг, AI помогает на каждом. Повторная продажа замыкает
 * цикл на «Запись», минуя рекламу.
 */
export function FinalChain() {
  return (
    <PlanSection id="system" eyebrow="Итог" title="Единая система вместо набора инструментов">
      <ol aria-label="Этапы клиентского цикла" className="grid gap-6 lg:grid-cols-5 lg:gap-5">
        {systemStages.map((stage, i) => (
          <li
            key={stage.label}
            className="relative flex items-center gap-4 rounded-xl border border-border bg-card p-5 lg:flex-col lg:items-start lg:gap-5 lg:p-6"
          >
            <IconBadge icon={stage.icon} className="h-12 w-12" />
            <p className="font-display text-sm font-bold uppercase leading-snug tracking-[0.12em] md:text-base">
              {stage.label}
            </p>
            {i < systemStages.length - 1 && (
              <>
                <ChevronDown
                  aria-hidden="true"
                  className="absolute left-1/2 top-full mt-1 h-4 w-4 -translate-x-1/2 text-primary lg:hidden"
                />
                <ChevronRight
                  aria-hidden="true"
                  className="absolute left-full top-1/2 ml-0.5 hidden h-4 w-4 -translate-y-1/2 text-primary lg:block"
                />
              </>
            )}
          </li>
        ))}
      </ol>

      {/* Тонкие связи от каждого этапа к слоям CRM / AI */}
      <div aria-hidden="true" className="mx-auto grid h-6 grid-cols-1 lg:h-8 lg:grid-cols-5 lg:gap-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={i === 0 ? 'mx-auto w-px bg-border' : 'mx-auto hidden w-px bg-border lg:block'} />
        ))}
      </div>

      <div className="space-y-3">
        {systemLayers.map(({ label, icon, text, chips }) => (
          <div
            key={label}
            className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 md:flex-row md:items-center md:gap-6 md:p-6"
          >
            <div className="flex items-center gap-4 md:w-72 md:shrink-0">
              <IconBadge icon={icon} className="h-12 w-12" />
              <div>
                <p className="font-display text-base font-bold uppercase tracking-[0.12em]">{label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground/90"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2.5 rounded-full border border-dashed border-primary/40 px-5 py-3 text-center text-sm text-primary">
        <Undo2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        {systemLoop}
      </p>

      <p className="mx-auto mt-14 max-w-3xl text-center font-display text-2xl font-bold leading-snug tracking-tight text-balance md:text-3xl">
        {systemCaption}
      </p>
    </PlanSection>
  )
}
