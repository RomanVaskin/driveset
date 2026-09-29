'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { loadPortfolioManifest, type PortfolioCategory, type PortfolioItem } from '@/lib/portfolio-manifest'
import { portfolioManifestUrl } from '@/lib/site-config'

const maxItems = 6

/**
 * Real works of one category from the production portfolio manifest only.
 * The manifest has no before/after pairing, so items are not labelled as
 * such. Renders nothing when there are no works or the manifest fails.
 */
export function PortfolioWorks({ category, description, itemLabel }: { category: PortfolioCategory; description: string; itemLabel: string }) {
  const [items, setItems] = useState<PortfolioItem[]>([])

  useEffect(() => {
    let active = true
    loadPortfolioManifest(portfolioManifestUrl)
      .then((all) => {
        if (active) setItems(all.filter((item) => item.category === category).slice(0, maxItems))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [category])

  if (items.length === 0) return null

  return (
    <section id="works" className="section-dark scroll-mt-20 border-y border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Реальные работы</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Результаты наших работ</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.src}>
              <a href={item.src} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-border bg-card" aria-label={`Открыть работу по ${itemLabel} ${index + 1}`}>
                <Image src={item.type === 'video' ? item.poster : item.thumb} alt={`Реальная работа DriveSet по ${itemLabel} автомобиля ${index + 1}`} fill loading="lazy" sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                {item.type === 'video' && (
                  <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white">
                    <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden="true" />
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
