import { CheckCircle2 } from 'lucide-react'
import { ContactActions } from '@/components/wrapping/contact-actions'

export type PolishingQuizResultProps = {
  car: string
  needs: readonly string[]
}

/**
 * Screen shown after a successful /api/lead response. Kept as a standalone
 * block so the future price mechanic (show now / after a call / never) can
 * replace it without touching the quiz steps.
 */
export function PolishingQuizResult({ car, needs }: PolishingQuizResultProps) {
  return (
    <div role="status">
      <span className="flex size-11 items-center justify-center rounded-full bg-champagne/15 text-champagne">
        <CheckCircle2 className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-3xl font-bold">Заявка отправлена</h3>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Менеджер DriveSet свяжется с вами, рассчитает стоимость полировки и предложит время бесплатного осмотра.
      </p>
      <dl className="mt-6 grid gap-3 rounded-xl border border-border bg-background p-5 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
        <dt className="text-muted-foreground">Автомобиль</dt>
        <dd className="ym-hide-content font-semibold">{car}</dd>
        <dt className="text-muted-foreground">Задачи</dt>
        <dd className="font-semibold">{needs.join(', ')}</dd>
      </dl>
      <p className="mt-8 font-semibold">Хотите быстрее — напишите или позвоните нам</p>
      <div className="mt-3"><ContactActions /></div>
    </div>
  )
}
