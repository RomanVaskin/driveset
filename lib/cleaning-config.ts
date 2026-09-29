/**
 * Content of /himchistka-avto. Prices and the offer mechanic are intentionally
 * absent: they will be decided later and must not be invented here.
 */

export const cleaningNav = [
  { label: 'Расчёт', href: '#calculator' },
  { label: 'Что чистим', href: '#zones' },
  { label: 'Работы', href: '#works' },
  { label: 'Процесс', href: '#process' },
] as const

export type CleaningNeedId =
  | 'full'
  | 'seats'
  | 'ceiling'
  | 'floor'
  | 'trunk'
  | 'odor'
  | 'pet-hair'
  | 'stains'
  | 'other'

export type CleaningServiceId =
  | 'complex'
  | 'seat'
  | 'ceiling'
  | 'floor'
  | 'trunk'
  | 'door-card'
  | 'panel'
  | 'mat'
  | 'steering-wheel'
  | 'ozonation'

/** Approved client price grid: indicative «от» prices, not a final quote. */
export const cleaningPrices: readonly { id: CleaningServiceId; title: string; priceLabel: string; unit?: string }[] = [
  { id: 'complex', title: 'Комплексная химчистка салона', priceLabel: 'от 10 000 ₽' },
  { id: 'seat', title: 'Химчистка одного сиденья', priceLabel: 'от 1 000 ₽', unit: 'за 1 шт.' },
  { id: 'ceiling', title: 'Химчистка потолка', priceLabel: 'от 2 500 ₽' },
  { id: 'floor', title: 'Химчистка пола / коврового покрытия', priceLabel: 'от 2 500 ₽' },
  { id: 'trunk', title: 'Химчистка багажника', priceLabel: 'от 1 500 ₽' },
  { id: 'door-card', title: 'Химчистка одной дверной карты', priceLabel: 'от 700 ₽', unit: 'за 1 шт.' },
  { id: 'panel', title: 'Химчистка панели / пластика', priceLabel: 'от 1 000 ₽' },
  { id: 'mat', title: 'Химчистка одного ворсового коврика', priceLabel: 'от 300 ₽', unit: 'за 1 шт.' },
  { id: 'steering-wheel', title: 'Химчистка руля', priceLabel: 'от 1 500 ₽' },
  { id: 'ozonation', title: 'Озонирование салона', priceLabel: 'от 1 500 ₽' },
] as const

export const cleaningPriceNote = 'Точная стоимость зависит от автомобиля, объёма работ и состояния салона.'

/**
 * Quiz step 2, independent multi-select. `service` links an answer to a price
 * row only where the wording matches without interpretation. Not linked on
 * purpose: «Сиденья» (the price is per one seat, the quiz does not ask how
 * many) and «Удаление запаха» (ozonation is one method, not the same service).
 */
export const cleaningNeeds: readonly { id: CleaningNeedId; label: string; service?: CleaningServiceId }[] = [
  { id: 'full', label: 'Полная химчистка', service: 'complex' },
  { id: 'seats', label: 'Сиденья' },
  { id: 'ceiling', label: 'Потолок', service: 'ceiling' },
  { id: 'floor', label: 'Пол / ковролин', service: 'floor' },
  { id: 'trunk', label: 'Багажник', service: 'trunk' },
  { id: 'odor', label: 'Удаление запаха' },
  { id: 'pet-hair', label: 'Шерсть животных' },
  { id: 'stains', label: 'Сложные пятна' },
  { id: 'other', label: 'Другое' },
] as const

/** «Другое» clarification; sized so every answer fits the /api/lead `package` limit. */
export const cleaningOtherMaxLength = 60

export const cleaningZones = [
  { title: 'Сиденья', text: 'Очистка сидений от загрязнений и пятен.' },
  { title: 'Потолок', text: 'Удаление загрязнений с потолка салона.' },
  { title: 'Пол и ковролин', text: 'Очистка напольного покрытия и ковриков.' },
  { title: 'Багажник', text: 'Химчистка багажного отделения.' },
  { title: 'Неприятные запахи', text: 'Работаем с посторонними запахами в салоне.' },
  { title: 'Шерсть и сложные пятна', text: 'Убираем шерсть животных и работаем со сложными пятнами.' },
] as const

export const cleaningZonesNote =
  'Состав работ и стоимость согласуем заранее: они зависят от автомобиля, объёма работ и состояния салона. Результат по сложным пятнам и запахам зависит от их происхождения.'

export const cleaningProcess = [
  { title: 'Заявка', text: 'Оставляете модель автомобиля и задачу — менеджер связывается с вами.' },
  { title: 'Оценка салона', text: 'Оцениваем загрязнения и состояние салона, уточняем задачу.' },
  { title: 'Согласование', text: 'Согласовываем объём работ и стоимость до начала работ.' },
  { title: 'Химчистка', text: 'Выполняем согласованные работы.' },
  { title: 'Выдача автомобиля', text: 'Показываем результат.' },
] as const

/** Only DriveSet-wide facts already confirmed in the project. */
export const cleaningBenefits = [
  'Запись без предоплаты',
  'Забор и возврат автомобиля',
  'Ответ на заявку до 15 минут в рабочее время',
  'Реальные фото и видео работ',
] as const

export const cleaningFaq = [
  {
    question: 'Сколько стоит химчистка салона?',
    answer: 'Стоимость зависит от автомобиля, объёма работ и состояния салона. Оставьте заявку — рассчитаем стоимость для вашего автомобиля.',
  },
  {
    question: 'Можно почистить только сиденья или потолок?',
    answer: 'Да. В заявке можно выбрать отдельные зоны: сиденья, потолок, пол, багажник — или полную химчистку.',
  },
  {
    question: 'Удалится ли запах или сложное пятно?',
    answer: 'Результат зависит от происхождения запаха или пятна. Что можно сделать в вашем случае, скажем после оценки салона.',
  },
  { question: 'Нужна ли предоплата?', answer: 'Нет, запись проводится без предоплаты.' },
  { question: 'Можно ли забрать автомобиль и вернуть после работ?', answer: 'Да, DriveSet предлагает забор и возврат автомобиля.' },
] as const
