import { CheckCircle2 } from 'lucide-react'
import { wrappingBenefits } from '@/lib/wrapping-config'

export function WrappingBenefits() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Почему DriveSet</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Контроль результата на каждом этапе</h2>
      </div>
      <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {wrappingBenefits.map((benefit) => (
          <li key={benefit} className="flex min-h-24 items-start gap-3 bg-card p-5 sm:p-6">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden="true" />
            <span className="text-sm font-medium leading-relaxed">{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
