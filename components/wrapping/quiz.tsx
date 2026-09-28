'use client'

import { ArrowLeft, ArrowRight, Check, Gift, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { submitLead } from '@/lib/lead-submission'
import { trackMarketingEvent, type MarketingEventName, type MarketingEventPayload } from '@/lib/marketing-events'
import {
  elementPrices,
  gifts,
  otherElementsOption,
  priceDisclaimer,
  promotionDeadlineLabel,
  quizPackageOptions,
  wrappingBenefits,
  wrappingPackages,
  type QuizPackageId,
} from '@/lib/wrapping-config'
import { getQuoteResult, initialQuizAnswers, type QuizAnswers, type QuizElementId } from '@/lib/wrapping-quiz'
import { ContactActions } from './contact-actions'

const questionCount = 2
const elementOptions = [...elementPrices.map(({ id, title }) => ({ id, title })), otherElementsOption] as const
const fullPpf = wrappingPackages.find((item) => item.id === 'full-ppf')
const promoDiscount = fullPpf?.regularPrice ? fullPpf.regularPrice - fullPpf.price : 0

export function WrappingQuiz() {
  // 0 — модель, 1 — что оклеить, 2 — телефон, после успешной заявки — предложение.
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(initialQuizAnswers)
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const tracked = useRef(new Set<string>())
  const quote = useMemo(() => getQuoteResult(answers), [answers])

  function trackOnce(name: MarketingEventName, payload?: MarketingEventPayload) {
    if (tracked.current.has(name)) return
    tracked.current.add(name)
    trackMarketingEvent(name, payload)
  }

  useEffect(() => {
    if (step === 2 && quote && !submitted) trackOnce('quiz_phone')
  }, [quote, step, submitted])

  useEffect(() => {
    // Fires after the offer is actually rendered, i.e. after lead_submit.
    if (step === 2 && quote && submitted) trackOnce('offer_view', { package: answers.packageId })
  }, [answers.packageId, quote, step, submitted])

  useEffect(() => {
    // Every «Рассчитать…» CTA on the page is a link to #calculator.
    function onClick(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest('a[href="#calculator"]')) trackOnce('quiz_start')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  function update<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    trackOnce('quiz_start')
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  function confirmCar() {
    trackOnce('car_selected')
    setStep(1)
  }

  function choosePackage(id: QuizPackageId) {
    update('packageId', id)
    trackOnce('package_selected', { package: id })
    if (id !== 'elements') setStep(2)
  }

  function toggleElement(id: QuizElementId) {
    setAnswers((current) => ({
      ...current,
      elementIds: current.elementIds.includes(id)
        ? current.elementIds.filter((item) => item !== id)
        : [...current.elementIds, id],
    }))
  }

  function confirmElements() {
    trackOnce('elements_selected')
    setStep(2)
  }

  function reset() {
    setAnswers(initialQuizAnswers)
    setStep(0)
    setSubmitted(false)
    setSubmitError('')
    tracked.current.clear()
  }

  async function sendQuizLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending || !quote) return
    const form = new FormData(event.currentTarget)
    setSending(true)
    setSubmitError('')
    const result = await submitLead({
      // The user leaves only a phone number; /api/lead names the lead «Заявка DriveSet».
      name: '',
      phone: String(form.get('phone') ?? ''),
      contactChannel: 'phone',
      vehicleModel: answers.car,
      package: quote.packageTitle,
      displayedPrice: quote.priceLabel ?? undefined,
      website: String(form.get('website') ?? ''),
    })
    setSending(false)
    if (result.ok) setSubmitted(true)
    else setSubmitError(result.error ?? 'Не удалось отправить заявку.')
  }

  const promoOffer = answers.packageId === 'full-ppf' && Boolean(quote?.promo)
  const progress = step < questionCount ? ((step + 1) / (questionCount + 1)) * 100 : 100
  return (
    <section id="calculator" className="scroll-mt-20 border-y border-border bg-card/45">
      <div className="mx-auto max-w-4xl px-5 py-20 md:py-28 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Расчёт стоимости</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Узнайте стоимость оклейки</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Модель и вариант оклейки — и предложение для вашего автомобиля готово.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="h-1 bg-secondary"><div className="h-full bg-champagne transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
          <div className="p-6 sm:p-8 md:p-10">
            {step < questionCount && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Шаг {step + 1} из {questionCount + 1}</p>

                {step === 0 && (
                  <Question title="Модель автомобиля" hint="Марку можно указать вместе с моделью">
                    <input autoFocus value={answers.car} onChange={(event) => update('car', event.target.value.slice(0, 80))} placeholder="Например: Geely Monjaro или Audi A6" className="ym-disable-keys h-14 w-full rounded-xl border border-input bg-background px-4 text-lg outline-none focus:border-champagne" />
                  </Question>
                )}
                {step === 1 && (
                  <Question title="Что хотите оклеить?" hint={answers.car}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {quizPackageOptions.map((option) => (
                        <button key={option.id} type="button" onClick={() => choosePackage(option.id)} className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${answers.packageId === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-champagne/50'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {answers.packageId === 'elements' && (
                      <div className="mt-5 border-t border-border pt-5">
                        <p className="mb-3 text-sm font-semibold">Выберите один или несколько элементов</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {elementOptions.map((item) => {
                            const selected = answers.elementIds.includes(item.id)
                            return (
                              <button key={item.id} type="button" aria-pressed={selected} onClick={() => toggleElement(item.id)} className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm ${selected ? 'border-champagne bg-champagne/10' : 'border-border'}`}>
                                <span className={`flex size-5 shrink-0 items-center justify-center rounded border ${selected ? 'border-champagne bg-champagne text-graphite' : 'border-border'}`}>{selected && <Check className="size-3.5" />}</span>
                                <span>{item.title}</span>
                              </button>
                            )
                          })}
                        </div>
                        <button type="button" disabled={answers.elementIds.length === 0} onClick={confirmElements} className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto">
                          Подтвердить выбор{answers.elementIds.length > 0 ? ` (${answers.elementIds.length})` : ''}<ArrowRight className="ml-2 size-4" />
                        </button>
                      </div>
                    )}
                  </Question>
                )}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  {step > 0 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="inline-flex h-12 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 size-4" />Назад</button> : <span />}
                  {step === 0 && (
                    <button type="button" disabled={answers.car.trim().length < 2} onClick={confirmCar} className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">
                      Продолжить<ArrowRight className="ml-2 size-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 2 && quote && !submitted && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-champagne">Шаг {questionCount + 1} из {questionCount + 1}</p>
                <h3 className="mt-3 font-display text-3xl font-bold">Предложение для вашего автомобиля готово</h3>
                <p className="ym-hide-content mt-2 text-lg font-semibold">{answers.car}</p>
                <p className="mt-1 text-sm text-muted-foreground">{quizPackageOptions.find((item) => item.id === answers.packageId)?.label}</p>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-champagne/30 bg-champagne/5 p-5">
                  <Gift className="mt-0.5 size-5 shrink-0 text-champagne" aria-hidden="true" />
                  <div>
                    {promoOffer ? (
                      <>
                        <p className="font-semibold">Для полной оклейки PPF действует акция: скидка {promoDiscount.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽ + подарок</p>
                        <p className="mt-1 text-sm text-muted-foreground">{promotionDeadlineLabel}</p>
                      </>
                    ) : (
                      <p className="font-semibold">Получите точную стоимость и подарок</p>
                    )}
                  </div>
                </div>
                <form onSubmit={sendQuizLead} className="mt-7 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium sm:max-w-sm">Телефон
                    <input name="phone" type="tel" required maxLength={32} autoComplete="tel" placeholder="+7 (___) ___-__-__" className="ym-disable-keys h-12 min-w-0 rounded-xl border border-input bg-background px-4 text-base outline-none focus:border-champagne" />
                  </label>
                  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="quiz-website">Сайт</label><input id="quiz-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
                  {/* Add the approved Privacy Policy link and consent control before production launch. */}
                  <div>
                    <button type="submit" disabled={sending} className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-35 sm:w-auto">{sending ? 'Отправляем…' : <>Показать цену и подарок<ArrowRight className="ml-2 size-4" /></>}</button>
                    <p className="mt-2 text-sm text-muted-foreground">Без предоплаты и обязательств</p>
                  </div>
                  {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
                </form>
                <div className="mt-7"><ContactActions /></div>
                <button type="button" onClick={() => setStep(1)} className="mt-6 inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 size-4" />Назад</button>
              </div>
            )}

            {step === 2 && quote && submitted && (
              <div>
                <p role="status" className="text-xs font-medium uppercase tracking-[0.16em] text-champagne">Заявка отправлена · ваше предложение</p>
                <h3 className="ym-hide-content mt-3 font-display text-3xl font-bold">{answers.car}</h3>
                <div className="mt-7 rounded-xl border border-champagne/30 bg-champagne/5 p-6">
                  <p className="font-display text-xl font-bold">{quote.packageTitle}</p>
                  {quote.regularPriceLabel && <p className="mt-4 text-muted-foreground line-through">{quote.regularPriceLabel}</p>}
                  {quote.priceLabel
                    ? <p className="mt-1 font-display text-3xl font-bold text-champagne">{quote.priceLabel}</p>
                    : <p className="mt-4 font-semibold">Точную стоимость подтвердим после бесплатного осмотра</p>}
                  {quote.promo && <p className="mt-2 text-sm font-semibold text-champagne">{promotionDeadlineLabel}</p>}
                  {quote.items && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {quote.items.map((item) => <li key={item.title} className="flex justify-between gap-3 border-t border-border pt-2 text-sm"><span>{item.title}</span><strong className="text-champagne">{item.priceLabel ?? 'после осмотра'}</strong></li>)}
                    </ul>
                  )}
                  <p className="mt-4 text-sm">Срок выполнения: <strong>{quote.duration}</strong></p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{priceDisclaimer}</p>

                <div className="mt-8 flex items-center gap-3 border-t border-border pt-7">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-champagne"><Gift className="size-5" /></span>
                  <h3 className="font-display text-2xl font-bold">Подарок при заказе</h3>
                </div>
                <p className="mt-2 text-muted-foreground">Один подарок на выбор</p>
                <ul className="mt-5 grid gap-2">
                  {gifts.map((gift) => (
                    <li key={gift.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden="true" />
                      <span><strong className="block">{gift.title}</strong>{gift.note && <span className="mt-1 block text-xs text-muted-foreground">{gift.note}</span>}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-8 grid gap-x-6 gap-y-2 border-t border-border pt-7 text-sm sm:grid-cols-2">
                  {wrappingBenefits.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 shrink-0 text-champagne" aria-hidden="true" />{item}</li>)}
                </ul>

                <p className="mt-8 font-semibold">Запишитесь на бесплатный осмотр</p>
                <div className="mt-3"><ContactActions /></div>
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
