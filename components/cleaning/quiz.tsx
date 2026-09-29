'use client'

import { ServiceQuiz } from '@/components/landing/service-quiz'
import { cleaningNeeds, cleaningOtherMaxLength } from '@/lib/cleaning-config'
import { CleaningQuizResult } from './quiz-result'

export function CleaningQuiz() {
  return (
    <ServiceQuiz
      eventPrefix="himchistka"
      title="Рассчитайте стоимость химчистки"
      subtitle="Три коротких шага: автомобиль, задача и телефон."
      needsTitle="Что нужно сделать?"
      needsHint="Можно выбрать несколько вариантов"
      options={cleaningNeeds}
      otherOption={{ id: 'other', maxLength: cleaningOtherMaxLength, placeholder: 'Например: чистка ремней безопасности' }}
      phoneTitle="Получите расчёт стоимости химчистки"
      phoneText="Стоимость зависит от автомобиля, объёма работ и состояния салона. Оставьте телефон — рассчитаем её для вашего автомобиля."
      honeypotId="cleaning-website"
      leadFields={(ids, otherText) => ({
        package: `Химчистка: ${cleaningNeeds
          .filter((item) => ids.includes(item.id))
          .map((item) => (item.id === 'other' && otherText ? `${item.label}: ${otherText}` : item.label))
          .join(', ')}`,
      })}
      renderResult={({ car, needs }) => <CleaningQuizResult car={car} needs={needs} />}
    />
  )
}
