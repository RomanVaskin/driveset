import Image from 'next/image'
import { ArrowDown, MapPin } from 'lucide-react'
import { site } from '@/lib/site-config'

const heroVideoSrc = 'https://driveset.ru/media/hero-optimized.mp4'
const heroPoster = '/images/hero-detailing.webp'

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-detailing.webp"
          alt="Премиальный автомобиль в чистом детейлинг-пространстве DriveSet"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:motion-safe:block"
          src={heroVideoSrc}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Тёмный кинематографичный оверлей поверх hero */}
        <div className="absolute inset-0 bg-[oklch(0.16_0.006_264/0.45)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.13_0.006_264/0.85)] via-[oklch(0.13_0.006_264/0.45)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.13_0.006_264/0.35)] via-transparent to-background" />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:min-h-[calc(100svh-5rem)] md:justify-center md:py-32 lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-[oklch(0.85_0.062_78)]" />
            {site.city} • {site.addressShort}
          </p>

          <h1 className="mt-6 font-display text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance text-white sm:text-5xl md:text-6xl lg:text-[4.75rem]">
            {site.tagline}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
            Защищаем кузов, возвращаем глубину цвета и приводим салон в порядок — аккуратно, прозрачно и в срок.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#lead"
              className="inline-flex items-center justify-center rounded-md bg-[oklch(0.85_0.062_78)] px-7 py-3.5 text-base font-semibold text-[oklch(0.2_0.01_264)] transition-opacity hover:opacity-90"
            >
              Рассчитать стоимость
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Посмотреть работы
              <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
