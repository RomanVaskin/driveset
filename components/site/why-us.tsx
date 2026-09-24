import { site, trustStats } from '@/lib/site-config'

export function WhyUs() {
  return (
    <section id="about" className="section-dark scroll-mt-20 border-y border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">{site.name} в цифрах</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Опыт, которому доверяют автомобиль
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-5">
          {trustStats.map((item, index) => (
            <div key={item.label} className={`flex min-h-36 flex-col justify-between bg-card p-5 sm:p-7 ${index === trustStats.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">0{index + 1}</span>
              <div className="mt-8">
                <p className={`font-display font-bold tracking-tight text-champagne ${item.value.length > 5 ? 'text-2xl' : 'text-4xl'}`}>
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
