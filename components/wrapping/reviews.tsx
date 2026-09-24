import { Star } from 'lucide-react'

export function WrappingReviews() {
  return (
    <section className="section-dark border-y border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-[auto_1fr] sm:items-center md:py-20 lg:px-8">
        <div className="flex items-center gap-5">
          <span className="font-display text-6xl font-extrabold tracking-tight text-champagne">5.0</span>
          <div>
            <div className="flex gap-1 text-champagne" aria-label="Рейтинг 5 из 5">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4" fill="currentColor" aria-hidden="true" />)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">41 отзыв</p>
          </div>
        </div>
        <div className="sm:border-l sm:border-border sm:pl-8">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Результат лучше любых обещаний</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Мы не публикуем вымышленные имена и тексты. Посмотрите реальные работы и получите расчёт для своего автомобиля.</p>
          <a href="#works" className="mt-5 inline-flex text-sm font-semibold text-champagne">Посмотреть работы</a>
        </div>
      </div>
    </section>
  )
}
