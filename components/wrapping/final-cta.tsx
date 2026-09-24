import { Camera } from 'lucide-react'
import { ContactActions } from './contact-actions'

export function WrappingFinalCta() {
  return (
    <section className="px-5 pb-20 md:pb-28 lg:px-8">
      <div className="section-dark mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border p-7 shadow-card sm:p-10 md:p-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Следующий шаг</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Рассчитайте стоимость оклейки вашего автомобиля</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">Получите предварительную цену сразу, а точную — после бесплатного осмотра.</p>
            <a href="#calculator" className="mt-7 inline-flex rounded-md bg-champagne px-7 py-3.5 font-semibold text-graphite">Перейти к расчёту</a>
          </div>
          <ContactActions />
        </div>

        <div id="photo-calc" className="mt-12 scroll-mt-24 border-t border-border pt-8">
          <div className="mb-5 flex items-start gap-3">
            <Camera className="mt-1 size-5 shrink-0 text-champagne" aria-hidden="true" />
            <div>
              <h3 className="font-display text-xl font-bold">Рассчитать по фото</h3>
              <p className="mt-1 text-sm text-muted-foreground">Отправьте фотографии автомобиля напрямую в Telegram или WhatsApp. Загрузка файлов на сайте не используется.</p>
            </div>
          </div>
          <ContactActions photoOnly whatsappText="Здравствуйте! Хочу рассчитать стоимость оклейки автомобиля по фото." />
        </div>
      </div>
    </section>
  )
}
