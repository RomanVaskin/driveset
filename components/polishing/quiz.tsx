'use client'

import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { submitLead } from '@/lib/lead-submission'
import { trackMarketingEvent, type MarketingEventName } from '@/lib/marketing-events'
import { polishingNeeds, type PolishingNeedId } from '@/lib/polishing-config'
import { PolishingQuizResult } from './quiz-result'

type PolishingEvent = Extract<MarketingEventName, `polirovka_${string}`>

const stepCount = 3

export function PolishingQuiz() {
  // 0 — модель, 1 — задачи, 2 — телефон; после успешной заявки — PolishingQuizResult.
  const [step, setStep] = useState(0)
  const [car, setCar] = useState('')
  const [needIds, setNeedIds] = useState<PolishingNeedId[]>([])
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const tracked = useRef(new Set<PolishingEvent>())

  // Selection order is irrelevant for the CRM; keep the catalogue order.
  const needLabels = polishingNeeds.filter((item) => needIds.includes(item.id)).map((item) => item.label)

  function trackOnce(name: PolishingEvent) {
    if (tracked.current.has(name)) return
    tracked.current.add(name)
    trackMarketingEvent(name)
  }

  useEffect(() => {
    if (step === 2 && !submitted) trackOnce('polirovka_quiz_phone')
  }, [step, submitted])

  useEffect(() => {
    // Every «Рассчитать стоимость» CTA on the page is a link to #calculator.
    function onClick(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest('a[href="#calculator"]')) trackOnce('polirovka_quiz_start')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  function toggleNeed(id: PolishingNeedId) {
    trackOnce('polirovka_quiz_start')
    setNeedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  async function sendLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    const form = new FormData(event.currentTarget)
    setSending(true)
    setSubmitError('')
    const result = await submitLead({
      // Phone-only lead: /api/lead gives it the technical CRM title «Заявка DriveSet».
      name: '',
      phone: String(form.get('phone') ?? ''),
      contactChannel: 'phone',
      vehicleModel: car,
      package: `Полировка: ${needLabels.join(', ')}`,
      website: String(form.get('website') ?? ''),
    }, 'polirovka_lead_submit')
    setSending(false)
    if (result.ok) setSubmitted(true)
    else setSubmitError(result.error ?? 'Не удалось отправить заявку.')
  }

  return (
    <section id="calculator" className="scroll-mt-20 border-y border-border bg-card/45">
      <div className="mx-auto max-w-4xl px-5 py-20 md:py-28 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-champagne">Расчёт стоимости</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">Рассчитайте стоимость полировки</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Три коротких шага: автомобиль, задача и телефон.</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="h-1 bg-secondary"><div className="h-full bg-champagne transition-[width] duration-300" style={{ width: `${submitted ? 100 : ((step + 1) / stepCount) * 100}%` }} /></div>
          <div className="p-6 sm:p-8 md:p-10">
            {submitted ? (
              <PolishingQuizResult car={car} needs={needLabels} />
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Шаг {step + 1} из {stepCount}</p>

                {step === 0 && (
                  <Question title="Модель автомобиля" hint="Марку можно указать вместе с моделью">
                    <input
                      value={car}
                      onChange={(event) => {
                        trackOnce('polirovka_quiz_start')
                        setCar(event.target.value.slice(0, 80))
                      }}
                      placeholder="Например: Geely Monjaro или Audi A6"
                      aria-label="Модель автомобиля"
                      className="ym-disable-keys h-14 w-full rounded-xl border border-input bg-background px-4 text-lg outline-none focus:border-champagne"
                    />
                  </Question>
                )}

                {step === 1 && (
                  <Question title="Что хотите сделать?" hint="Можно выбрать несколько вариантов">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {polishingNeeds.map((item) => {
                        const selected = needIds.includes(item.id)
                        return (
                          <button key={item.id} type="button" aria-pressed={selected} onClick={() => toggleNeed(item.id)} className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${selected ? 'border-champagne bg-champagne/10' : 'border-border bg-background hover:border-champagne/50'}`}>
                            <span className={`flex size-5 shrink-0 items-center justify-center rounded border ${selected ? 'border-champagne bg-champagne text-graphite' : 'border-border'}`}>{selected && <Check className="size-3.5" />}</span>
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </Question>
                )}

                {step === 2 && (
                  <div className="mt-4">
                    <h3 className="font-display text-2xl font-bold md:text-3xl">Получите расчёт стоимости полировки</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Стоимость зависит от автомобиля, состояния ЛКП и выбранных работ. Оставьте телефон — рассчитаем её для вашего автомобиля.</p>
                    <form onSubmit={sendLead} className="mt-6 grid gap-4">
                      <label className="grid gap-2 text-sm font-medium sm:max-w-sm">Телефон
                        <input name="phone" type="tel" required maxLength={32} autoComplete="tel" placeholder="+7 (___) ___-__-__" className="ym-disable-keys h-12 min-w-0 rounded-xl border border-input bg-background px-4 text-base outline-none focus:border-champagne" />
                      </label>
                      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="polishing-website">Сайт</label><input id="polishing-website" name="website" type="text" autoComplete="off" tabIndex={-1} /></div>
                      {/* Add the approved Privacy Policy link and consent control before production launch. */}
                      <div>
                        <button type="submit" disabled={sending} className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-35 sm:w-auto">{sending ? 'Отправляем…' : <>Получить расчёт<ArrowRight className="ml-2 size-4" /></>}</button>
                      </div>
                      {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
                    </form>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  {step > 0 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="inline-flex h-12 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 size-4" />Назад</button> : <span />}
                  {step === 0 && (
                    <button type="button" disabled={car.trim().length < 2} onClick={() => { trackOnce('polirovka_car_selected'); setStep(1) }} className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">
                      Продолжить<ArrowRight className="ml-2 size-4" />
                    </button>
                  )}
                  {step === 1 && (
                    <button type="button" disabled={needIds.length === 0} onClick={() => { trackOnce('polirovka_service_selected'); setStep(2) }} className="inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-35">
                      Продолжить{needIds.length > 0 ? ` (${needIds.length})` : ''}<ArrowRight className="ml-2 size-4" />
                    </button>
                  )}
                </div>
              </>
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
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}
