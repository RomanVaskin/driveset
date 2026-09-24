'use client'

import Image from 'next/image'
import { Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { parsePortfolioManifest, type PortfolioVideo } from '@/lib/portfolio-manifest'
import { portfolioManifestUrl } from '@/lib/site-config'

let wrappingVideosRequest: Promise<PortfolioVideo[]> | null = null

function loadWrappingVideos() {
  if (!wrappingVideosRequest) {
    wrappingVideosRequest = fetch(portfolioManifestUrl, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Portfolio manifest is unavailable')
        return response.json() as Promise<unknown>
      })
      .then((manifest) => parsePortfolioManifest(manifest).filter(
        (item): item is PortfolioVideo => item.category === 'wrapping' && item.type === 'video',
      ))
      .catch((error) => {
        wrappingVideosRequest = null
        throw error
      })
  }
  return wrappingVideosRequest
}

function useWrappingVideos() {
  const [videos, setVideos] = useState<PortfolioVideo[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    void loadWrappingVideos()
      .then((items) => {
        if (active) setVideos(items)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [])

  return { videos, failed }
}

export function WrappingHeroMedia() {
  const { videos, failed } = useWrappingVideos()
  const firstVideo = videos?.[0]

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.13_0.005_264)] shadow-2xl sm:min-h-[480px] md:min-h-[570px]">
      {firstVideo ? (
        <>
          <Image src={firstVideo.poster} alt="Реальный автомобиль в работе по оклейке DriveSet" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">Реальная работа DriveSet</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">Видео загружается только после открытия — на первом экране используется оптимизированный poster.</p>
          </div>
        </>
      ) : (
        <div className="flex h-full min-h-[360px] flex-col justify-end p-7 sm:min-h-[480px] md:min-h-[570px]">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,transparent_45%,oklch(1_0_0/0.08)_50%,transparent_55%)] [background-size:3rem_3rem]" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-champagne">Реальные работы DriveSet</p>
          <p className="relative mt-2 text-sm text-white/60">{failed ? 'Не удалось загрузить portfolio manifest.' : 'Загружаем оптимизированное превью…'}</p>
        </div>
      )}
    </div>
  )
}

export function WrappingWorksClient() {
  const { videos, failed } = useWrappingVideos()
  const [selectedVideo, setSelectedVideo] = useState<PortfolioVideo | null>(null)

  useEffect(() => {
    if (!selectedVideo) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedVideo(null)
    }
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', close)
    }
  }, [selectedVideo])

  if (!videos) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse rounded-xl border border-border bg-card" />
        ))}
        {failed && <p className="col-span-2 mt-2 text-sm text-muted-foreground md:col-span-3">Реальные работы временно не загрузились. Попробуйте обновить страницу позже.</p>}
      </div>
    )
  }

  if (videos.length === 0) {
    return <p className="mt-10 text-sm text-muted-foreground">В manifest пока нет доступных wrapping-видео.</p>
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {videos.map((video, index) => (
          <button key={video.src} type="button" onClick={() => setSelectedVideo(video)} className={`group relative overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft ${index === 0 ? 'col-span-2 aspect-[16/10] md:col-span-2 md:row-span-2 md:aspect-auto' : 'aspect-[4/5]'}`} aria-label={`Открыть видео работы по оклейке ${index + 1}`}>
            <Image src={video.poster} alt={`Реальная работа DriveSet по оклейке автомобиля, видео ${index + 1}`} fill loading="lazy" sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white backdrop-blur-sm">
              <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden="true" />
            </span>
            <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">Оклейка · видео</span>
          </button>
        ))}
      </div>

      {selectedVideo && (
        <div role="dialog" aria-modal="true" aria-label="Видео работы DriveSet" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setSelectedVideo(null)
        }}>
          <button type="button" autoFocus onClick={() => setSelectedVideo(null)} className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white md:right-8 md:top-8" aria-label="Закрыть видео">
            <X className="size-5" aria-hidden="true" />
          </button>
          <video src={selectedVideo.src} poster={selectedVideo.poster} controls autoPlay playsInline preload="none" className="max-h-[88vh] max-w-full rounded-xl bg-black shadow-2xl md:max-w-5xl">
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      )}
    </>
  )
}
