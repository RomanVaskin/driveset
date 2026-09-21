import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { site } from '@/lib/site-config'

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-detailing.png"
          alt="Премиальный автомобиль в чистом детейлинг-пространстве DriveSet"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Тёмный кинематографичный оверлей поверх фото — hero остаётся премиальным,
            при этом мягко растворяется в светлой странице внизу. */}
        <div className="absolute inset-0 bg-[oklch(0.16_0.006_264/0.45)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.13_0.006_264/0.85)] via-[oklch(0.13_0.006_264/0.45)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.13_0.006_264/0.35)] via-transparent to-background" />
      </div>

      <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 py-24 md:min-h-[92svh] md:py-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-[oklch(0.85_0.062_78)]" />
            {site.city} • {site.addressShort}
          </p>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {site.name}
          </h1>

          <p className="mt-4 font-display text-xl font-medium text-white/90 sm:text-2xl md:text-3xl">
            {site.tagline}
          </p>

          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-[oklch(0.85_0.062_78)]">
            Химчистка • Полировка • Оклейка
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Профессиональный уход, защита и восстановление внешнего вида автомобиля в Москве.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#lead"
              className="inline-flex items-center justify-center rounded-md bg-[oklch(0.85_0.062_78)] px-7 py-3.5 text-base font-semibold text-[oklch(0.2_0.01_264)] transition-opacity hover:opacity-90"
            >
              Записаться
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Наши услуги
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
