'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { services } from '@/lib/site-config'
import { submitLead } from '@/lib/lead-submission'

export function LeadForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const form = new FormData(e.currentTarget)
    setSending(true)
    setError('')
    const service = services.find((item) => item.id === form.get('service'))
    const result = await submitLead({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      contactChannel: 'phone',
      vehicleModel: String(form.get('car') ?? ''),
      package: service?.title ?? (form.get('service') === 'other' ? 'Другое / не знаю' : ''),
      website: String(form.get('website') ?? ''),
    })
    setSending(false)
    if (result.ok) setSubmitted(true)
    else setError(result.error ?? 'Не удалось отправить заявку.')
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
            maxLength={80}
            autoComplete="name"
            placeholder="Как к вам обращаться"
            className="ym-disable-keys h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
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
            maxLength={32}
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            className="ym-disable-keys h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
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
            maxLength={80}
            placeholder="Марка и модель"
            className="ym-disable-keys h-12 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
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
          disabled={sending}
          className="mt-1 inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {sending ? 'Отправляем…' : 'Отправить заявку'}
        </button>
        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="lead-website">Сайт</label><input id="lead-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
        {/* Add the approved Privacy Policy link and consent control before production launch. */}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  )
}
