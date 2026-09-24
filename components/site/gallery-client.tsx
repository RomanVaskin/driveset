'use client'

import Image from 'next/image'
import { Play, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  parsePortfolioManifest,
  type PortfolioCategory,
  type PortfolioItem,
} from '@/lib/portfolio-manifest'
import type { GalleryItem } from '@/lib/site-config'

type CategoryFilter = 'all' | PortfolioCategory

type GalleryClientProps = {
  categoryLabels: Record<PortfolioCategory, string>
  fallbackItems: GalleryItem[]
  manifestUrl: string
}

function mediaAlt(item: PortfolioItem, categoryLabel: string) {
  const kind = item.type === 'video' ? 'Видео работы' : 'Работа'
  return `${kind} DriveSet: ${categoryLabel}`
}

export function GalleryClient({ categoryLabels, fallbackItems, manifestUrl }: GalleryClientProps) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadManifest() {
      try {
        const response = await fetch(manifestUrl, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) return
        const parsed = parsePortfolioManifest(await response.json())
        if (parsed.length > 0) setItems(parsed)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    void loadManifest()
    return () => controller.abort()
  }, [manifestUrl])

  useEffect(() => {
    if (!selectedItem) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedItem(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedItem])

  const visibleItems = useMemo(() => {
    if (!items || activeCategory === 'all') return items ?? []
    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  if (!items) {
    return (
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {fallbackItems.map((item, index) => (
          <div
            key={item.image}
            className={`relative overflow-hidden rounded-xl border border-border shadow-soft ${
              index === 0
                ? 'col-span-2 aspect-[16/10] md:col-span-2 md:row-span-2 md:aspect-auto'
                : 'aspect-square'
            }`}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" aria-label="Фильтр галереи">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            activeCategory === 'all'
              ? 'border-champagne bg-champagne text-background'
              : 'border-border text-muted-foreground hover:border-champagne hover:text-foreground'
          }`}
        >
          Все работы
        </button>
        {(Object.entries(categoryLabels) as [PortfolioCategory, string][]).map(([category, label]) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeCategory === category
                ? 'border-champagne bg-champagne text-background'
                : 'border-border text-muted-foreground hover:border-champagne hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {visibleItems.map((item, index) => {
          const preview = item.type === 'image' ? item.thumb : item.poster
          const alt = mediaAlt(item, categoryLabels[item.category])
          return (
            <button
              key={item.src}
              type="button"
              onClick={() => setSelectedItem(item)}
              aria-label={`Открыть: ${alt}`}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card text-left shadow-soft ${
                index === 0 && activeCategory === 'all'
                  ? 'col-span-2 aspect-[16/10] md:col-span-2 md:row-span-2 md:aspect-auto'
                  : 'aspect-square'
              }`}
            >
              <Image
                src={preview}
                alt={alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-xs font-medium uppercase tracking-[0.14em] text-white">
                {categoryLabels[item.category]}
              </span>
              {item.type === 'video' && (
                <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/55 text-white backdrop-blur-sm">
                  <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden="true" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр работы DriveSet"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedItem(null)
          }}
        >
          <button
            type="button"
            autoFocus
            onClick={() => setSelectedItem(null)}
            aria-label="Закрыть"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:border-white/60 md:right-8 md:top-8"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <div className="relative h-full max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl">
            {selectedItem.type === 'image' ? (
              <Image
                src={selectedItem.src}
                alt={mediaAlt(selectedItem, categoryLabels[selectedItem.category])}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            ) : (
              <video
                src={selectedItem.src}
                poster={selectedItem.poster}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
