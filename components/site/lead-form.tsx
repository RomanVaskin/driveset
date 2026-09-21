'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { services } from '@/lib/site-config'

/**
 * Frontend-only lead form (этап 1).
 * На следующем этапе сюда подключается backend / Telegram-уведомления / CRM.
 * Пока просто показываем состояние успешной отправки на клиенте.
 */
export function LeadForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-champagne/40 bg-card p-8 shadow-soft">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="font-display text-xl font-bold">Заявка отправлена</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Спасибо! Мы свяжемся с вами, чтобы подобрать услугу и удобное время.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8">
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Имя
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Как к вам обращаться"
            className="h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            className="h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="car" className="text-sm font-medium">
            Автомобиль
          </label>
          <input
            id="car"
            name="car"
            type="text"
            placeholder="Марка и модель"
            className="h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="service" className="text-sm font-medium">
            Интересующая услуга
          </label>
          <select
            id="service"
            name="service"
            defaultValue=""
            className="h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors focus:border-ring"
          >
            <option value="" disabled>
              Выберите услугу
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
            <option value="other">Другое / не знаю</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Отправить заявку
        </button>
      </div>
    </form>
  )
}
