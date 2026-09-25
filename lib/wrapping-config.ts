export const wrappingNav = [
  { label: 'Пакеты', href: '#packages' },
  { label: 'Расчёт', href: '#calculator' },
  { label: 'Работы', href: '#works' },
  { label: 'Процесс', href: '#process' },
] as const

export const promotionDeadlineLabel = 'Акция действует до 30 сентября 2026 года включительно'

export type WrappingPackageId = 'front' | 'full-ppf' | 'matte-ppf' | 'color' | 'elements' | 'unknown'

export type WrappingPackage = {
  id: Exclude<WrappingPackageId, 'elements' | 'unknown'>
  title: string
  price: number
  priceLabel: string
  duration: string
  description: string
  items?: readonly string[]
  regularPrice?: number
  regularPriceLabel?: string
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
    title: 'Передняя часть',
    price: 85000,
    priceLabel: 'от 85 000 ₽',
    duration: '2–3 дня',
    description: 'Защита зон, которые первыми принимают на себя камни, песок и дорожные реагенты.',
    items: frontPackageItems,
  },
  {
    id: 'full-ppf',
    title: 'Полный кузов PPF',
    price: 190000,
    priceLabel: 'от 190 000 ₽ по акции',
    regularPrice: 210000,
    regularPriceLabel: 'от 210 000 ₽',
    duration: '3–5 дней',
    description: 'Полная защита лакокрасочного покрытия прозрачной полиуретановой плёнкой.',
    featured: true,
  },
  {
    id: 'matte-ppf',
    title: 'Полный кузов — матовый PPF',
    price: 230000,
    priceLabel: 'от 230 000 ₽',
    duration: '3–5 дней',
    description: 'Защита всего кузова с ровным матовым визуальным эффектом.',
  },
  {
    id: 'color',
    title: 'Цветная оклейка',
    price: 230000,
    priceLabel: 'от 230 000 ₽',
    duration: '3–5 дней',
    description: 'Изменение цвета автомобиля с подбором плёнки и образцов в студии.',
  },
] as const

export const quizPackageOptions: readonly { id: WrappingPackageId; label: string }[] = [
  { id: 'front', label: 'Передняя часть' },
  { id: 'full-ppf', label: 'Полный кузов PPF' },
  { id: 'matte-ppf', label: 'Матовый PPF' },
  { id: 'color', label: 'Цветная оклейка' },
  { id: 'elements', label: 'Отдельные элементы' },
  { id: 'unknown', label: 'Не знаю — нужна рекомендация' },
] as const

export const timingOptions = [
  'Как можно скорее',
  'В течение недели',
  'В течение месяца',
  'Пока узнаю стоимость',
] as const

export type ElementPriceId = 'hood' | 'bumper' | 'roof' | 'fender' | 'headlights' | 'windshield' | 'chrome-delete'

export const elementPrices: readonly {
  id: ElementPriceId
  title: string
  price: number
  priceLabel: string
}[] = [
  { id: 'hood', title: 'Капот', price: 20000, priceLabel: 'от 20 000 ₽' },
  { id: 'bumper', title: 'Передний бампер', price: 22000, priceLabel: 'от 22 000 ₽' },
  { id: 'roof', title: 'Крыша', price: 22000, priceLabel: 'от 22 000 ₽' },
  { id: 'fender', title: 'Переднее крыло', price: 12000, priceLabel: 'от 12 000 ₽' },
  { id: 'headlights', title: 'Фары', price: 7000, priceLabel: 'от 7 000 ₽' },
  { id: 'windshield', title: 'Защита лобового стекла', price: 30000, priceLabel: 'от 30 000 ₽' },
  { id: 'chrome-delete', title: 'Антихром', price: 20000, priceLabel: 'от 20 000 ₽' },
] as const

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
