export const wrappingNav = [
  { label: 'Пакеты', href: '#packages' },
  { label: 'Расчёт', href: '#calculator' },
  { label: 'Работы', href: '#works' },
  { label: 'Процесс', href: '#process' },
] as const

/**
 * Full-body PPF promotion: −10 000 ₽ off the regular «от 150 000 ₽», shown
 * separately from the price. Applies only to `full-ppf` — never to the front
 * package, colour wrap or other services. Single source of its dates.
 */
export const promotionStartsAt = new Date('2026-10-01T00:00:00+03:00')
export const promotionEndsAt = new Date('2026-10-15T23:59:59+03:00')
export const promotionDiscount = 10000
export const promotionBadge = '−10 000 ₽ на полную оклейку PPF до 15 октября'
export const promotionDeadlineLabel = 'Акция действует с 1 по 15 октября 2026 года включительно'

export function isPromotionActive(now: Date = new Date()) {
  return now.getTime() >= promotionStartsAt.getTime() && now.getTime() <= promotionEndsAt.getTime()
}

export type WrappingPackageId = 'front' | 'full-ppf' | 'matte-ppf' | 'color' | 'elements' | 'unknown'

export type WrappingPackage = {
  id: Exclude<WrappingPackageId, 'elements' | 'unknown'>
  title: string
  price: number
  priceLabel: string
  duration: string
  description: string
  items?: readonly string[]
  featured?: boolean
}

export const frontPackageItems = [
  'Передний бампер',
  'Капот',
  '2 передних крыла',
  '2 фары',
  'Стойки вдоль лобового стекла',
  'Полоса крыши над лобовым стеклом',
] as const

export const wrappingPackages: readonly WrappingPackage[] = [
  {
    id: 'front',
    title: 'Зоны риска (передняя часть)',
    price: 50000,
    priceLabel: 'от 50 000 ₽',
    duration: '2–3 дня',
    description: 'Защита зон, которые первыми принимают на себя камни, песок и дорожные реагенты.',
    items: frontPackageItems,
  },
  {
    id: 'full-ppf',
    title: 'Полная оклейка PPF',
    price: 150000,
    priceLabel: 'от 150 000 ₽',
    duration: '3–5 дней',
    description: 'Полная защита лакокрасочного покрытия прозрачной полиуретановой плёнкой.',
    featured: true,
  },
  {
    id: 'matte-ppf',
    title: 'Полный кузов — матовый PPF',
    price: 150000,
    priceLabel: 'от 150 000 ₽',
    duration: '3–5 дней',
    description: 'Защита всего кузова с ровным матовым визуальным эффектом.',
  },
  {
    id: 'color',
    title: 'Цветная оклейка',
    price: 150000,
    priceLabel: 'от 150 000 ₽',
    duration: '3–5 дней',
    description: 'Изменение цвета автомобиля с подбором плёнки и образцов в студии.',
  },
] as const

export type QuizPackageId = 'front' | 'full-ppf' | 'color'

/** Quiz step 2: the services that have their own package card on the page. */
export const quizPackageOptions: readonly { id: QuizPackageId; label: string }[] = [
  { id: 'front', label: 'Зоны риска / передняя часть PPF' },
  { id: 'full-ppf', label: 'Полная оклейка PPF' },
  { id: 'color', label: 'Цветная оклейка' },
] as const

export const timingOptions = [
  'Как можно скорее',
  'В течение недели',
  'В течение месяца',
  'Пока узнаю стоимость',
] as const

export type ElementPriceId = 'hood' | 'bumper' | 'roof' | 'fender' | 'headlights' | 'windshield' | 'chrome-delete'

/** Elements available separately; shown on the page as a list without prices. */
export const elementPrices: readonly { id: ElementPriceId; title: string }[] = [
  { id: 'hood', title: 'Капот' },
  { id: 'bumper', title: 'Передний бампер' },
  { id: 'roof', title: 'Крыша' },
  { id: 'fender', title: 'Переднее крыло' },
  { id: 'headlights', title: 'Фары' },
  { id: 'windshield', title: 'Защита лобового стекла' },
  { id: 'chrome-delete', title: 'Антихром' },
] as const

/** Gifts for full-body PPF only (one of them, chosen in the quiz). */
export type GiftId = 'rain' | 'leather-protection' | 'leather-ceramic' | 'transfer' | 'coupon'

export const gifts: readonly { id: GiftId; title: string; note?: string }[] = [
  { id: 'rain', title: 'Антидождь' },
  { id: 'leather-protection', title: 'Защита кожи салона' },
  { id: 'leather-ceramic', title: 'Керамика кожи салона' },
  { id: 'transfer', title: 'Забор и возврат автомобиля' },
  {
    id: 'coupon',
    title: 'Купон 10 000 ₽ на следующую услугу DriveSet от 30 000 ₽',
    note: 'Срок действия — 6 месяцев',
  },
] as const

export const filmBrands = ['PPF Union', 'Wematec', 'STEK'] as const

export const wrappingBenefits = [
  '5 лет опыта',
  '3 мастера',
  '41 отзыв',
  'Рейтинг 5.0',
  'Гарантия 3 года',
  'Бесплатный осмотр',
  'Запись без предоплаты',
  'Реальные фото и видео работ',
  'Выбор плёнки и образцов',
  'Забор и возврат автомобиля',
  'Персональный онлайн-трекер работ',
  'Ответ на заявку до 15 минут в рабочее время',
] as const

export const wrappingTrackerPreview = {
  title: 'Следите за оклейкой автомобиля онлайн',
  description: 'После приёмки автомобиля получите персональную ссылку. Смотрите этап работ, фото и видео процесса и дату готовности — без звонков в студию.',
  car: 'Geely Monjaro',
  order: 'Заказ №DS-1042',
  service: 'Полная оклейка PPF',
  stages: [
    { title: 'Автомобиль принят', status: 'complete' },
    { title: 'Подготовка', status: 'complete' },
    { title: 'Оклейка — сейчас', status: 'current' },
    { title: 'Контроль качества', status: 'upcoming' },
    { title: 'Готов к выдаче', status: 'upcoming' },
  ],
  readyAt: '28 сентября, 18:00',
  caption: 'На каждом этапе можно посмотреть фото и видео работ.',
} as const

export const wrappingProcess = [
  { title: 'Бесплатный осмотр', text: 'Осматриваем автомобиль и уточняем задачу до начала работ.' },
  { title: 'Фотофиксация кузова', text: 'Фиксируем исходное состояние автомобиля вместе с вами.' },
  { title: 'Подготовка', text: 'Моем кузов, глубоко очищаем его от битума, металлических включений и других загрязнений, затем обезжириваем.' },
  { title: 'Полировка и разборка при необходимости', text: 'Согласовываем и выполняем только те подготовительные работы, которые нужны конкретному автомобилю.' },
  { title: 'Оклейка', text: 'Наносим выбранную плёнку на согласованные элементы или весь кузов.' },
  { title: 'Выдача автомобиля', text: 'Показываем результат и объясняем дальнейший уход.' },
  { title: 'Обязательная коррекция через 10 дней', text: 'Бесплатно проверяем результат и выполняем необходимую коррекцию. Прохождение этой проверки — условие гарантии 3 года.' },
] as const

export const faqItems = [
  { question: 'Сколько занимает оклейка?', answer: 'Передняя часть обычно занимает 2–3 дня, полный кузов — 3–5 дней.' },
  { question: 'Какая гарантия?', answer: 'Гарантия DriveSet — 3 года при прохождении обязательной бесплатной коррекции.' },
  { question: 'Когда нужна коррекция?', answer: 'Обязательная бесплатная коррекция проводится через 10 дней после оклейки.' },
  { question: 'Можно ли выбрать плёнку?', answer: 'Да. Можно выбрать конкретный бренд или серию и посмотреть образцы в студии.' },
  { question: 'Нужна ли предоплата?', answer: 'Нет, запись проводится без предоплаты.' },
  { question: 'Можно ли оклеить отдельный элемент?', answer: 'Да. Можно защитить капот, бампер, крышу, крыло, фары или лобовое стекло, а также сделать антихром.' },
  { question: 'Можно ли забрать автомобиль и вернуть после работ?', answer: 'Да, DriveSet предлагает забор и возврат автомобиля.' },
  { question: 'Как определяется точная цена?', answer: 'Точная стоимость зависит от автомобиля, выбранной плёнки и состояния кузова и подтверждается после бесплатного осмотра.' },
] as const

export const priceDisclaimer =
  'Точная стоимость зависит от автомобиля, выбранной плёнки и состояния кузова и подтверждается после бесплатного осмотра.'
