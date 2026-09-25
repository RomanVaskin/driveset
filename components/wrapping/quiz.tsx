'use client'

import { ArrowLeft, ArrowRight, Check, Gift, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { submitLead, type LeadDraft } from '@/lib/lead-submission'
import { trackMarketingEvent } from '@/lib/marketing-events'
import {
  elementPrices,
  gifts,
  priceDisclaimer,
  quizPackageOptions,
  timingOptions,
} from '@/lib/wrapping-config'
import { getQuoteResult, initialQuizAnswers, type QuizAnswers } from '@/lib/wrapping-quiz'
import { ContactActions } from './contact-actions'

const questionCount = 5

export function WrappingQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(initialQuizAnswers)
  const [contactChannel, setContactChannel] = useState<LeadDraft['contactChannel']>('phone')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const tracked = useRef(new Set<string>())
  const quote = useMemo(() => getQuoteResult(answers), [answers])

  useEffect(() => {
    if (step === 5 && quote && !tracked.current.has('price_shown')) {
      tracked.current.add('price_shown')
      trackMarketingEvent('price_shown', { package: answers.packageId, displayed_price: quote.priceLabel ?? undefined })
    }
  }, [answers.packageId, quote, step])

  function markStarted() {
    if (tracked.current.has('quiz_start')) return
    tracked.current.add('quiz_start')
    trackMarketingEvent('quiz_start')
  }

  function update<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    markStarted()
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  function next() {
    if (step === 2) {
      trackMarketingEvent('car_selected')
    }
    setStep((current) => current + 1)
  }

  function reset() {
    setAnswers(initialQuizAnswers)
    setStep(0)
    setContactChannel('phone')
    setSubmitted(false)
    setSubmitError('')
    tracked.current.clear()
  }

  async function sendQuizLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending || !quote || !answers.giftId) return
    const form = new FormData(event.currentTarget)
    setSending(true)
    setSubmitError('')
    const result = await submitLead({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      contactChannel,
      vehicleMake: answers.brand,
      vehicleModel: answers.model,
      vehicleYear: answers.year,
      package: quote.packageTitle,
      displayedPrice: quote.priceLabel ?? undefined,
      gift: gifts.find((item) => item.id === answers.giftId)?.title,
      timing: answers.timing,
      website: String(form.get('website') ?? ''),
    })
    setSending(false)
    if (result.ok) setSubmitted(true)
    else setSubmitError(result.error ?? 'Не удалось отправить заявку.')
  }

  const canContinue =
    (step === 0 && answers.brand.trim().length >= 2)
    || (step === 1 && answers.model.trim().length >= 1)
    || (step === 2 && /^\d{4}$/.test(answers.year))
    || (step === 3 && Boolean(answers.packageId) && (answers.packageId !== 'elements' || Boolean(answers.elementId)))
    || (step === 4 && Boolean(answers.timing))

  const progress = step < questionCount ? ((step + 1) / questionCount) * 100 : 100
  return (
    <section id="calculator" className="scroll-mt-20 border-y border-border bg-card/45">
      <div className="mx-auto max-w-4xl px-5 py-20 md:py-28 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Предварительный расчёт</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Узнайте стоимость до передачи контакта</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Пять коротких шагов — и вы увидите предварительную стоимость оклейки.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="h-1 bg-secondary"><div className="h-full bg-champagne transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
          <div className="p-6 sm:p-8 md:p-10">
            {step < questionCount && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Шаг {step + 1} из {questionCount}</p>

                {step === 0 && (
                  <Question title="Марка автомобиля" hint="Например, Geely, Chery, BMW или другая марка">
                    <input autoFocus value={answers.brand} onChange={(event) => update('brand', event.target.value.slice(0, 60))} placeholder="Введите марку" autoComplete="organization" className="ym-disable-keys h-14 w-full rounded-xl border border-input bg-background px-4 text-lg outline-none focus:border-champagne" />
                  </Question>
                )}
                {step === 1 && (
                  <Question title="Модель" hint={`Марка: ${answers.brand}`}>
                    <input autoFocus value={answers.model} onChange={(event) => update('model', event.target.value.slice(0, 80))} placeholder="Введите модель" className="ym-disable-keys h-14 w-full rounded-xl border border-input bg-background px-4 text-lg outline-none focus:border-champagne" />
                  </Question>
                )}
                {step === 2 && (
                  <Question title="Год выпуска" hint={`${answers.brand} ${answers.model}`}>
                    <input autoFocus value={answers.year} onChange={(event) => update('year', event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="2025" inputMode="numeric" pattern="[0-9]{4}" className="ym-disable-keys h-14 w-full rounded-xl border border-input bg-background px-4 text-lg outline-none focus:border-champagne" />
                  </Question>
                )}
                {step === 3 && (
                  <Question title="Что требуется?" hint={`${answers.brand} ${answers.model}, ${answers.year}`}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {quizPackageOptions.map((option) => (
                        <button key={option.id} type="button" onClick={() => {
                          update('packageId', option.id)
                          if (option.id !== 'elements') update('elementId', '')
                          trackMarketingEvent('package_selected', { package: option.id })
                        }} className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${answers.packageId === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-champagne/50'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {answers.packageId === 'elements' && (
                      <div className="mt-5 border-t border-border pt-5">
                        <p className="mb-3 text-sm font-semibold">Выберите элемент для предварительной цены</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {elementPrices.map((item) => (
                            <button key={item.id} type="button" onClick={() => update('elementId', item.id)} className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm ${answers.elementId === item.id ? 'border-champagne bg-champagne/10' : 'border-border'}`}>
                              <span>{item.title}</span><span className="ml-3 text-champagne">{item.priceLabel}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </Question>
                )}
                {step === 4 && (
                  <Question title="Когда хотите сделать?" hint="Это не влияет на предварительную цену">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {timingOptions.map((option) => (
                        <button key={option} type="button" onClick={() => update('timing', option)} className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold ${answers.timing === option ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-champagne/50'}`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </Question>
                )}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  {step > 0 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="inline-flex h-12 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 size-4" />Назад</button> : <span />}
                  <button type="button" disabled={!canContinue} onClick={next} className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">
                    {step === questionCount - 1 ? 'Показать стоимость' : 'Продолжить'}<ArrowRight className="ml-2 size-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 5 && quote && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-champagne">Предварительный расчёт готов</p>
                <h3 className="ym-hide-content mt-3 font-display text-3xl font-bold">{answers.brand} {answers.model}</h3>
                <p className="mt-1 text-muted-foreground">{answers.year} год · {answers.timing}</p>
                <div className="mt-7 rounded-xl border border-champagne/30 bg-champagne/5 p-6">
                  <p className="font-display text-xl font-bold">{quote.packageTitle}</p>
                  {quote.regularPriceLabel && <p className="mt-4 text-muted-foreground line-through">{quote.regularPriceLabel}</p>}
                  {quote.priceLabel && <p className="mt-1 font-display text-3xl font-bold text-champagne">{quote.priceLabel}</p>}
                  <p className="mt-4 text-sm">Срок выполнения: <strong>{quote.duration}</strong></p>
                  {quote.comparison && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {quote.comparison.map((item) => <li key={item.title} className="flex justify-between gap-3 border-t border-border pt-2 text-sm"><span>{item.title}</span><strong className="text-champagne">{item.priceLabel}</strong></li>)}
                    </ul>
                  )}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{priceDisclaimer}</p>
                <div className="mt-8 flex items-center gap-3 border-t border-border pt-7">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne"><Gift className="size-5" /></span>
                  <h3 className="font-display text-2xl font-bold">Выберите подарок при заказе</h3>
                </div>
                <p className="mt-2 text-muted-foreground">Один подарок на выбор.</p>
                <div className="mt-7 grid gap-3">
                  {gifts.map((gift) => (
                    <button key={gift.id} type="button" onClick={() => {
                      update('giftId', gift.id)
                      trackMarketingEvent('gift_selected', { gift: gift.id })
                    }} className={`flex items-center gap-4 rounded-xl border p-4 text-left ${answers.giftId === gift.id ? 'border-champagne bg-champagne/10' : 'border-border bg-background'}`}>
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${answers.giftId === gift.id ? 'border-champagne bg-champagne text-graphite' : 'border-border'}`}>{answers.giftId === gift.id && <Check className="size-4" />}</span>
                      <span><strong className="block text-sm">{gift.title}</strong>{gift.note && <span className="mt-1 block text-xs text-muted-foreground">{gift.note}</span>}</span>
                    </button>
                  ))}
                </div>
                <button type="button" disabled={!answers.giftId} onClick={() => setStep(6)} className="mt-7 inline-flex h-12 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-35">Перейти к контакту<ArrowRight className="ml-2 size-4" /></button>
              </div>
            )}

            {step === 6 && quote && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-champagne">Точный расчёт</p>
                <h3 className="mt-3 font-display text-3xl font-bold">Оставьте контакт для точного расчёта</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">DriveSet отвечает в рабочее время максимум за 15 минут. Ежедневно 10:00–22:00.</p>
                {submitted ? (
                  <p role="status" className="mt-7 rounded-xl border border-champagne/40 bg-champagne/10 p-5 font-semibold">Заявка отправлена. Мы свяжемся с вами.</p>
                ) : (
                  <form onSubmit={sendQuizLead} className="mt-7 grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">Имя
                        <input name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder="Как к вам обращаться" className="ym-disable-keys h-12 min-w-0 rounded-xl border border-input bg-background px-4 text-base outline-none focus:border-champagne" />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">Телефон
                        <input name="phone" type="tel" required maxLength={32} autoComplete="tel" placeholder="+7 (___) ___-__-__" className="ym-disable-keys h-12 min-w-0 rounded-xl border border-input bg-background px-4 text-base outline-none focus:border-champagne" />
                      </label>
                    </div>
                    <fieldset>
                      <legend className="mb-3 text-sm font-medium">Удобный канал связи</legend>
                      <div className="flex flex-wrap gap-3">
                        {([['telegram', 'Telegram'], ['max', 'MAX'], ['phone', 'Телефон']] as const).map(([value, label]) => (
                          <label key={value} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm">
                            <input type="radio" name="contactChannel" value={value} checked={contactChannel === value} onChange={() => setContactChannel(value)} />{label}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="quiz-website">Сайт</label><input id="quiz-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
                    {/* Add the approved Privacy Policy link and consent control before production launch. */}
                    <button type="submit" disabled={sending} className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-35">{sending ? 'Отправляем…' : 'Отправить заявку'}</button>
                    {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
                  </form>
                )}
                <div className="mt-7"><ContactActions /></div>
                <button type="button" onClick={reset} className="mt-6 inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="mr-2 size-4" />Начать новый расчёт</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Question({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-display text-2xl font-bold md:text-3xl">{title}</h3>
      <p className="ym-hide-content mt-2 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}
