import Image from 'next/image'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FlowStep } from '@/lib/plan-config'
import { IconBadge } from './plan-section'

/** Tailwind не видит динамических классов, поэтому брейкпоинты перечислены явно. */
const layout = {
  md: {
    list: 'md:flex-row md:gap-5',
    item: 'md:flex-1 md:basis-0',
    head: 'md:flex-col md:items-start',
    down: 'md:hidden',
    right: 'md:block',
  },
  lg: {
    list: 'lg:flex-row lg:gap-5',
    item: 'lg:flex-1 lg:basis-0',
    head: 'lg:flex-col lg:items-start',
    down: 'lg:hidden',
    right: 'lg:block',
  },
} as const

/**
 * Цепочка шагов со стрелками: вертикальная на мобильных, горизонтальная с `from` (md/lg).
 * Стрелки живут в промежутках между карточками (gap), поэтому не ломают сетку.
 */
export function FlowChain({
  steps,
  label,
  inset = false,
  from = 'lg',
  className,
}: {
  steps: readonly FlowStep[]
  label: string
  /** Для использования внутри другой карточки: фон темнее, без «двойной» рамки. */
  inset?: boolean
  /** С какого брейкпоинта цепочка становится горизонтальной. */
  from?: 'md' | 'lg'
  className?: string
}) {
  const l = layout[from]
  return (
    <ol aria-label={label} className={cn('flex flex-col gap-6', l.list, className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li
            key={step.label}
            className={cn(
              'relative flex min-w-0 flex-col gap-3 rounded-xl border border-border p-4',
              l.item,
              inset ? 'bg-background/60' : 'bg-card',
            )}
          >
            <div className={cn('flex items-center gap-3', l.head)}>
              <IconBadge icon={step.icon} />
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-tight">{step.label}</p>
                {step.note && <p className="mt-1 text-xs leading-snug text-muted-foreground">{step.note}</p>}
              </div>
            </div>

            {step.chips && (
              <ul className="flex flex-wrap gap-1.5">
                {step.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/90"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            )}

            {step.thumbs && (
              <ul className="grid grid-cols-3 gap-1.5">
                {step.thumbs.map((thumb) => (
                  <li key={thumb.alt} className="relative aspect-square overflow-hidden rounded-md">
                    <Image src={thumb.src} alt={thumb.alt} fill sizes="80px" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}

            {!isLast && (
              <>
                <ChevronDown
                  aria-hidden="true"
                  className={cn('absolute left-1/2 top-full mt-1 h-4 w-4 -translate-x-1/2 text-primary', l.down)}
                />
                <ChevronRight
                  aria-hidden="true"
                  className={cn('absolute left-full top-1/2 ml-0.5 hidden h-4 w-4 -translate-y-1/2 text-primary', l.right)}
                />
              </>
            )}
          </li>
        )
      })}
    </ol>
  )
}
