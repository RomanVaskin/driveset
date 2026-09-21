import { advantages, site } from '@/lib/site-config'

export function WhyUs() {
  return (
    <section id="about" className="scroll-mt-20 border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">
            Почему {site.name}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Спокойный, предсказуемый результат
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, i) => (
            <div key={item.title} className="flex flex-col gap-4 bg-background p-7">
              <span className="font-display text-sm font-semibold text-champagne">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-display text-lg font-semibold leading-snug text-pretty">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
