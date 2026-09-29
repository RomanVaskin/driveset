'use client'

import { ServiceQuiz } from '@/components/landing/service-quiz'
import { polishingNeeds } from '@/lib/polishing-config'
import { describePolishingSelection, polishingLeadFields, togglePolishingNeed } from '@/lib/polishing-quiz'
import { PolishingQuizResult } from './quiz-result'

export function PolishingQuiz() {
  return (
    <ServiceQuiz
      eventPrefix="polirovka"
      title="Рассчитайте стоимость полировки"
      subtitle="Три коротких шага: автомобиль, задача и телефон."
      needsTitle="Что хотите получить?"
      needsHint="Можно добавить к кузову отдельный элемент или фары"
      options={polishingNeeds}
      toggle={togglePolishingNeed}
      phoneTitle="Получите расчёт стоимости полировки"
      phoneText="Стоимость зависит от автомобиля, состояния ЛКП и выбранных работ. Оставьте телефон — рассчитаем её для вашего автомобиля."
      honeypotId="polishing-website"
      leadFields={(ids) => polishingLeadFields(describePolishingSelection(ids))}
      renderResult={({ car, needs }) => <PolishingQuizResult car={car} needs={needs} />}
    />
  )
}
