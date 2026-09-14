import { MapPin, Clock, Phone, Send, MessageCircle } from 'lucide-react'
import { site } from '@/lib/site-config'
import { YandexMap } from './yandex-map'
import { LeadForm } from './lead-form'

const contactRows = [
  { icon: MapPin, label: 'Адрес', value: site.address },
  { icon: Clock, label: 'Часы работы', value: site.workHoursPlaceholder },
  { icon: Phone, label: 'Телефон', value: site.phonePlaceholder },
  { icon: Send, label: 'Telegram', value: site.telegramPlaceholder },
  { icon: MessageCircle, label: 'WhatsApp', value: site.whatsappPlaceholder },
]

export function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Контакты</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            {site.name} в Москве
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <address className="not-italic">
              <dl className="divide-y divide-border rounded-xl border border-border bg-card">
                {contactRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-4 p-5">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <row.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-base font-medium text-pretty">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </address>
            <YandexMap />
          </div>

          <div id="lead" className="scroll-mt-24">
            <h3 className="mb-4 font-display text-xl font-bold">Оставить заявку</h3>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  )
}
