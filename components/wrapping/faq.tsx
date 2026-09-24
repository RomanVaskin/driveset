import { faqItems } from '@/lib/wrapping-config'

export function WrappingFaq() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 md:py-28 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">Коротко о главном</h2>
      </div>
      <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {faqItems.map((item, index) => (
          <details key={item.question} className="group px-5 py-1 sm:px-7" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-display font-semibold marker:content-none">
              {item.question}
              <span className="text-xl font-normal text-champagne transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
