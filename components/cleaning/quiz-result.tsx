import { Camera, CheckCircle2 } from 'lucide-react'
import { ContactActions } from '@/components/wrapping/contact-actions'

export type CleaningQuizResultProps = {
  car: string
  needs: readonly string[]
}

/**
 * Screen shown after a successful /api/lead response. Standalone so the
 * future price mechanic (show now / after a call / never) can replace it
 * without touching the quiz steps.
 */
export function CleaningQuizResult({ car, needs }: CleaningQuizResultProps) {
  return (
    <div role="status">
      <span className="flex size-11 items-center justify-center rounded-full bg-champagne/15 text-champagne">
        <CheckCircle2 className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-3xl font-bold">Заявка отправлена</h3>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Менеджер DriveSet свяжется с вами и рассчитает стоимость химчистки.
      </p>
      <dl className="mt-6 grid gap-3 rounded-xl border border-border bg-background p-5 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
        <dt className="text-muted-foreground">Автомобиль</dt>
        <dd className="ym-hide-content font-semibold">{car}</dd>
        <dt className="text-muted-foreground">Что нужно сделать</dt>
        <dd className="ym-hide-content font-semibold">{needs.join(', ')}</dd>
      </dl>
      <p className="mt-8 flex items-start gap-3 font-semibold">
        <Camera className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden="true" />
        Чтобы расчёт был точнее, отправьте фотографии салона в Telegram или MAX
      </p>
      <div className="mt-3"><ContactActions /></div>
    </div>
  )
}
