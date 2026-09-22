import Image from 'next/image'
import { galleryItems } from '@/lib/site-config'

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

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryItems.map((item, i) => (
            <div
              key={item.image}
              className={`relative overflow-hidden rounded-xl border border-border shadow-soft ${
                i === 0
                  ? 'col-span-2 aspect-[16/10] md:col-span-2 md:row-span-2 md:aspect-auto'
                  : 'aspect-square'
              }`}
            >
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
