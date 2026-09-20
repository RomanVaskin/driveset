import { Target } from 'lucide-react'
import { kpiRule, kpis } from '@/lib/plan-config'
import { PlanSection } from './plan-section'

export function KpiSection() {
  return (
    <PlanSection
      id="kpi"
      tinted
      eyebrow="KPI"
      title="Как понять, что система работает"
      lead="Семь показателей на одном экране. Данные — из Метрики и CRM, поэтому этап 1 обязателен."
    >
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, formula, source, icon: Icon }) => (
          <li key={label} className="flex flex-col gap-3 bg-background p-6">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="font-display text-lg font-semibold leading-snug">{label}</p>
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{formula}</p>
            <span className="w-fit rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
              {source}
            </span>
          </li>
        ))}
        <li className="flex flex-col gap-3 bg-card p-6">
          <Target className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="font-display text-lg font-semibold leading-snug text-primary">Главное правило</p>
          <p className="text-sm leading-relaxed text-foreground/90">{kpiRule}</p>
        </li>
      </ul>
    </PlanSection>
  )
}
