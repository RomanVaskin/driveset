import { channels, promotionFlow } from '@/lib/plan-config'
import { FlowChain } from './flow-chain'
import { IconBadge, PlanSection } from './plan-section'

export function Promotion() {
  return (
    <PlanSection
      id="promotion"
      eyebrow="Продвижение"
      title="Шесть каналов — одна воронка"
      lead="Каждый канал ведёт на страницу конкретной услуги, а не на общую главную: так проще измерять результат и повышать конверсию."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <li key={channel.id}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <IconBadge icon={channel.icon} />
                <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {channel.role}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{channel.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {channel.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-border bg-card/40 p-4 md:p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Как канал превращается в запись
        </p>
        <FlowChain steps={promotionFlow} label="Путь от источника до записи" />
      </div>
    </PlanSection>
  )
}
