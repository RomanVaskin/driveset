'use client'

import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { submitLead, type LeadDraft } from '@/lib/lead-submission'
import { trackMarketingEvent, type MarketingEventName, type MarketingEventPayload } from '@/lib/marketing-events'
import {
  gifts,
  promotionBadge,
  quizPackageOptions,
  wrappingBenefits,
  type QuizPackageId,
} from '@/lib/wrapping-config'
import { hasGiftStep, initialQuizAnswers, quizLeadFields, selectedGift, showsPromotion, type QuizAnswers } from '@/lib/wrapping-quiz'
import { ContactActions } from './contact-actions'

const contactChannels = [['phone', 'Телефон'], ['telegram', 'Telegram'], ['max', 'MAX']] as const

// Steps: 0 — автомобиль, 1 — услуга, 2 — подарок (только полная PPF), 3 — контакт.
const CAR = 0
const SERVICE = 1
const GIFT = 2
const CONTACT = 3

export function WrappingQuiz() {
  const [step, setStep] = useState(CAR)
  const [answers, setAnswers] = useState<QuizAnswers>(initialQuizAnswers)
  const [contactChannel, setContactChannel] = useState<LeadDraft['contactChannel']>('phone')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const tracked = useRef(new Set<string>())

  function trackOnce(name: MarketingEventName, payload?: MarketingEventPayload) {
    if (tracked.current.has(name)) return
    tracked.current.add(name)
    trackMarketingEvent(name, payload)
  }

  useEffect(() => {
    // Reaching the contact step, not a lead: lead_submit fires only after 201 {ok:true}.
    if (step === CONTACT && answers.packageId && !submitted) trackOnce('quiz_phone')
  }, [answers.packageId, step, submitted])

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
    setStep(SERVICE)
  }

  function choosePackage(id: QuizPackageId) {
    update('packageId', id)
    trackOnce('package_selected', { package: id })
    setSubmitError('')
    setStep(hasGiftStep(id) ? GIFT : CONTACT)
  }

  function reset() {
    setAnswers(initialQuizAnswers)
    setStep(CAR)
    setContactChannel('phone')
    setSubmitted(false)
    setSubmitError('')
    tracked.current.clear()
  }

  async function sendQuizLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending || !answers.packageId) return
    const form = new FormData(event.currentTarget)
    setSending(true)
    setSubmitError('')
    const result = await submitLead({
      // No name is asked; /api/lead names the lead «Заявка DriveSet».
      name: '',
      phone: String(form.get('phone') ?? ''),
      contactChannel,
      ...quizLeadFields(answers),
      website: String(form.get('website') ?? ''),
    })
    setSending(false)
    if (result.ok) setSubmitted(true)
    else setSubmitError(result.error ?? 'Не удалось отправить заявку.')
  }

  const withGift = hasGiftStep(answers.packageId)
  const gift = selectedGift(answers)
  const promo = showsPromotion(answers.packageId)
  const serviceLabel = quizPackageOptions.find((item) => item.id === answers.packageId)?.label
  const totalSteps = withGift ? 4 : 3
  const stepNumber = step === CONTACT ? totalSteps : step + 1
  const progress = submitted ? 100 : (stepNumber / (totalSteps + 1)) * 100
  const back = <button type="button" onClick={() => setStep(step === CONTACT && !withGift ? SERVICE : step - 1)} className="inline-flex h-12 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 size-4" />Назад</button>
  const summary = (
    <div className="mt-4 rounded-xl border border-border bg-background p-5">
      <p className="ym-hide-content text-lg font-semibold">{answers.car}</p>
      <p className="mt-1 text-sm">{serviceLabel}</p>
      {gift && <p className="mt-1 text-sm font-semibold">🎁 {gift.title}</p>}
      {promo && <p className="mt-2 text-sm font-semibold text-champagne">{promotionBadge}</p>}
    </div>
  )
  return (
    <section id="calculator" className="scroll-mt-20 border-y border-border bg-card/45">
      <div className="mx-auto max-w-4xl px-5 py-20 md:py-28 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Расчёт стоимости</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Узнайте стоимость оклейки</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Укажите автомобиль и услугу — менеджер DriveSet рассчитает стоимость для вашего автомобиля.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="h-1 bg-secondary"><div className="h-full bg-champagne transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
          <div className="p-6 sm:p-8 md:p-10">
            {!submitted && (
              <p className={`text-xs font-medium uppercase tracking-[0.16em] ${step === CONTACT ? 'text-champagne' : 'text-muted-foreground'}`}>Шаг {stepNumber} из {totalSteps}</p>
            )}

            {step === CAR && (
              <>
                <Question title="Модель автомобиля" hint="Марку можно указать вместе с моделью">
                  <input autoFocus value={answers.car} onChange={(event) => update('car', event.target.value.slice(0, 80))} placeholder="Например: Geely Monjaro или Audi A6" className="ym-disable-keys h-14 w-full rounded-xl border border-input bg-background px-4 text-lg outline-none focus:border-champagne" />
                </Question>
                <div className="mt-8 flex justify-end border-t border-border pt-6">
                  <button type="button" disabled={answers.car.trim().length < 2} onClick={confirmCar} className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">
                    Продолжить<ArrowRight className="ml-2 size-4" />
                  </button>
                </div>
              </>
            )}

            {step === SERVICE && (
              <>
                <Question title="Что хотите сделать?" hint={answers.car}>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {quizPackageOptions.map((option) => (
                      <button key={option.id} type="button" onClick={() => choosePackage(option.id)} className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${answers.packageId === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-champagne/50'}`}>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Question>
                <div className="mt-8 border-t border-border pt-6">{back}</div>
              </>
            )}

            {step === GIFT && withGift && (
              <>
                <div className="mt-4">
                  <h3 className="font-display text-2xl font-bold md:text-3xl">Выберите подарок 🎁</h3>
                  <p className="mt-2 text-sm text-muted-foreground">При полной оклейке кузова PPF выберите подарок.</p>
                  <div role="radiogroup" aria-label="Подарок" className="mt-6 grid gap-2">
                    {gifts.map((item) => {
                      const selected = answers.giftId === item.id
                      return (
                        <button key={item.id} type="button" role="radio" aria-checked={selected} onClick={() => update('giftId', item.id)} className={`flex items-center gap-4 rounded-xl border p-4 text-left ${selected ? 'border-champagne bg-champagne/10' : 'border-border bg-background hover:border-champagne/50'}`}>
                          <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-champagne bg-champagne text-graphite' : 'border-border'}`}>{selected && <Check className="size-4" />}</span>
                          <span><strong className="block text-sm">{item.title}</strong>{item.note && <span className="mt-1 block text-xs text-muted-foreground">{item.note}</span>}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  {back}
                  <button type="button" disabled={!answers.giftId} onClick={() => setStep(CONTACT)} className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">
                    Продолжить<ArrowRight className="ml-2 size-4" />
                  </button>
                </div>
              </>
            )}

            {step === CONTACT && answers.packageId && !submitted && (
              <div>
                <h3 className="mt-3 font-display text-3xl font-bold">Остался последний шаг</h3>
                {summary}
                <form onSubmit={sendQuizLead} className="mt-7 grid gap-4">
                  <fieldset>
                    <legend className="mb-3 font-display text-xl font-bold">{withGift ? 'Куда отправить персональный расчёт стоимости и зафиксировать подарок?' : 'Куда отправить персональный расчёт стоимости?'}</legend>
                    <div className="flex flex-wrap gap-3">
                      {contactChannels.map(([value, label]) => (
                        <label key={value} className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${contactChannel === value ? 'border-champagne bg-champagne/10' : 'border-border'}`}>
                          <input type="radio" name="contactChannel" value={value} checked={contactChannel === value} onChange={() => setContactChannel(value)} />{label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="grid gap-2 text-sm font-medium sm:max-w-sm">{contactChannel === 'phone' ? 'Телефон' : `Номер телефона, привязанный к ${contactChannel === 'telegram' ? 'Telegram' : 'MAX'}`}
                    <input name="phone" type="tel" required maxLength={32} autoComplete="tel" placeholder="+7 (___) ___-__-__" className="ym-disable-keys h-12 min-w-0 rounded-xl border border-input bg-background px-4 text-base outline-none focus:border-champagne" />
                  </label>
                  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="quiz-website">Сайт</label><input id="quiz-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
                  {/* Add the approved Privacy Policy link and consent control before production launch. */}
                  <div>
                    <button type="submit" disabled={sending} className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-35 sm:w-auto">{sending ? 'Отправляем…' : <>{withGift ? 'Получить расчёт + подарок' : 'Получить расчёт'}<ArrowRight className="ml-2 size-4" /></>}</button>
                    <p className="mt-2 text-sm text-muted-foreground">Без предоплаты и обязательств</p>
                  </div>
                  {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
                </form>
                <div className="mt-7"><ContactActions /></div>
                <div className="mt-6">{back}</div>
              </div>
            )}

            {step === CONTACT && answers.packageId && submitted && (
              <div>
                <p role="status" className="text-xs font-medium uppercase tracking-[0.16em] text-champagne">Заявка отправлена</p>
                <h3 className="mt-3 font-display text-3xl font-bold">Спасибо! Менеджер DriveSet рассчитает стоимость</h3>
                <p className="mt-2 text-muted-foreground">Персональный расчёт отправим выбранным способом связи.</p>
                {summary}
                <ul className="mt-8 grid gap-x-6 gap-y-2 border-t border-border pt-7 text-sm sm:grid-cols-2">
                  {wrappingBenefits.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 shrink-0 text-champagne" aria-hidden="true" />{item}</li>)}
                </ul>
                <div className="mt-8"><ContactActions /></div>
                <button type="button" onClick={reset} className="mt-6 inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"><RotateCcw className="mr-2 size-4" />Новая заявка</button>
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
