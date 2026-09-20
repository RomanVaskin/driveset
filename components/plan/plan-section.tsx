import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Секция страницы /plan: те же отступы, eyebrow и h2, что и на лендинге. */
export function PlanSection({
  id,
  eyebrow,
  title,
  lead,
  tinted = false,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  tinted?: boolean
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn('scroll-mt-20', tinted && 'border-y border-border bg-card/40')}>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {lead && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
              {lead}
            </p>
          )}
        </div>
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  )
}

/** Квадратная иконка-плашка в акцентном цвете. */
export function IconBadge({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary',
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

/** Подпись группы карточек: «До записи ————». */
export function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      <span>{children}</span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </p>
  )
}
