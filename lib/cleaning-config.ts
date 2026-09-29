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

/**
 * Quiz step 2, independent multi-select. No option carries a price, so any
 * combination is valid; «Полная химчистка» next to single zones is simply
 * passed to the CRM as the client chose it.
 */
export const cleaningNeeds: readonly { id: CleaningNeedId; label: string }[] = [
  { id: 'full', label: 'Полная химчистка' },
  { id: 'seats', label: 'Сиденья' },
  { id: 'ceiling', label: 'Потолок' },
  { id: 'floor', label: 'Пол / ковролин' },
  { id: 'trunk', label: 'Багажник' },
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
