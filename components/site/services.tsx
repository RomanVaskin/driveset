import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { services } from '@/lib/site-config'

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Услуги</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
          Всё необходимое для внешнего вида и защиты автомобиля
        </h2>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:border-champagne/40 hover:shadow-card ${
              service.featured ? 'md:col-span-2 md:grid md:grid-cols-[1.2fr_0.8fr]' : 'flex flex-col'
            }`}
          >
            <div className={`relative overflow-hidden ${service.featured ? 'aspect-[4/3] md:aspect-auto md:min-h-[440px]' : 'aspect-[4/3]'}`}>
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes={service.featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 50vw'}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {service.featured && (
                <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-graphite/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  Приоритетное направление
                </span>
              )}
            </div>
            <div className={`flex flex-1 flex-col ${service.featured ? 'p-7 md:justify-center md:p-10' : 'p-6 md:p-7'}`}>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className={`font-display font-bold tracking-tight ${service.featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                  {service.title}
                </h3>
                <span className="shrink-0 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-xs font-semibold whitespace-nowrap text-champagne">
                  {service.price}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {service.description}
              </p>
              {service.features && (
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border py-5 text-sm">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-champagne">
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={service.href}
                className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-champagne transition-opacity hover:opacity-80"
              >
                {service.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
