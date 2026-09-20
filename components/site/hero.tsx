import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { site } from '@/lib/site-config'

// Видео лежит на production вне репозитория (MP4 в git не храним).
const heroVideoSrc = 'https://driveset.ru/media/hero-optimized.mp4'
const heroPoster = '/images/hero-detailing.png'

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroPoster}
          alt="Премиальный автомобиль в чистом детейлинг-пространстве DriveSet"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          src={heroVideoSrc}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-background/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/40 md:via-background/50 md:to-background/10" />
      </div>

      <div className="mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 py-24 md:min-h-[92svh] md:py-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {site.city} • {site.addressShort}
          </p>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            {site.name}
          </h1>

          <p className="mt-4 font-display text-xl font-medium text-foreground/90 sm:text-2xl md:text-3xl">
            {site.tagline}
          </p>

          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Химчистка • Полировка • Оклейка
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Профессиональный уход, защита и восстановление внешнего вида автомобиля в Москве.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#lead"
              className="inline-flex items-center justify-center rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Записаться
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background/30 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
            >
              Наши услуги
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
