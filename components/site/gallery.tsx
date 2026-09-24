import { GalleryClient } from '@/components/site/gallery-client'
import {
  galleryCategoryLabels,
  galleryItems,
  portfolioManifestUrl,
} from '@/lib/site-config'

export function Gallery() {
  return (
    <section id="gallery" className="section-dark scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Работы</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Примеры выполненных работ
          </h2>
        </div>

        <GalleryClient
          categoryLabels={galleryCategoryLabels}
          fallbackItems={galleryItems}
          manifestUrl={portfolioManifestUrl}
        />
      </div>
    </section>
  )
}
