/**
 * Content of /polirovka-avto. Prices and the offer mechanic are intentionally
 * absent: they will be defined later and must not be invented here.
 */

export const polishingNav = [
  { label: 'Расчёт', href: '#calculator' },
  { label: 'Что решаем', href: '#problems' },
  { label: 'Цены', href: '#prices' },
  { label: 'Работы', href: '#works' },
  { label: 'Процесс', href: '#process' },
] as const

/**
 * Market benchmarks the client price grid was derived from (competitor
 * research). Internal reference only — never rendered on the page.
 */
export const polishingMarketBenchmarks = [
  { service: 'Локальный элемент (бампер, крыло, дверь)', range: '1 000–4 000 ₽', average: '~2 300 ₽', sources: 3 },
  { service: 'Капот / крыша (крупный элемент)', range: '4 000 ₽', average: '4 000 ₽', sources: 1, note: 'данных мало' },
  { service: 'Полировка / восстановление фар', range: '2 000–5 000 ₽', average: '~3 300 ₽', sources: 3 },
  { service: 'Полировка бокового стекла', range: '3 000–7 000 ₽', average: '~5 000 ₽', sources: 2 },
  { service: 'Полировка лобового стекла', range: '3 000–10 000 ₽', average: '~6 500 ₽', sources: 2 },
  { service: 'Подготовка кузова перед полировкой (мойка + глина + обезжиривание)', range: '7 000–9 000 ₽', average: '~7 500 ₽', sources: 2 },
  { service: 'Антиголограммная / лёгкая полировка (2 этапа, весь кузов)', range: '9 000–30 000 ₽', average: '~18 000 ₽', sources: 5 },
  { service: 'Средняя восстановительная полировка (2–3 этапа)', range: '20 000–50 000 ₽', average: '~35 000 ₽', sources: 3 },
  { service: 'Глубокая абразивная полировка (3 этапа, весь кузов)', range: '50 000–70 000 ₽', average: '~60 000 ₽', sources: 2 },
  { service: 'Полировка после свежей покраски', range: '43 000–60 000 ₽', average: '~50 000 ₽', note: 'данных мало' },
  { service: 'Полировка + керамическое покрытие', average: '35 000 ₽', note: 'данных мало' },
] as const

export type PolishingServiceId = 'local' | 'headlights' | 'light' | 'restorative' | 'deep'

/** Approved client price grid: indicative «от» prices, not a final quote. */
export const polishingPrices: readonly { id: PolishingServiceId; title: string; priceLabel: string }[] = [
  { id: 'local', title: 'Локальная полировка элемента', priceLabel: 'от 2 500 ₽' },
  { id: 'headlights', title: 'Полировка фар', priceLabel: 'от 3 500 ₽' },
  { id: 'light', title: 'Лёгкая полировка кузова', priceLabel: 'от 18 000 ₽' },
  { id: 'restorative', title: 'Восстановительная полировка кузова', priceLabel: 'от 35 000 ₽' },
  { id: 'deep', title: 'Глубокая абразивная полировка', priceLabel: 'от 60 000 ₽' },
] as const

export const polishingPriceNote = 'Точная стоимость зависит от автомобиля, состояния ЛКП и объёма работ.'

/** Shown without prices: no approved client price exists for them yet. */
export const polishingExtraServices = [
  'Капот / крыша',
  'Полировка стекла',
  'Подготовка кузова',
  'Полировка после свежей покраски',
  'Керамическое покрытие',
] as const

export type PolishingNeedId = 'gloss' | 'light-scratches' | 'defects' | 'element' | 'headlights' | 'estimate'

/**
 * Quiz step 2: the client describes the result, not the technique. `service`
 * is an indicative UI classification, not a diagnosis of the paint; «Не знаю»
 * deliberately has no service and no price. Whole-body levels (`body`) are
 * mutually exclusive; element and headlights combine with them.
 */
export const polishingNeeds: readonly { id: PolishingNeedId; label: string; service?: PolishingServiceId; body?: true }[] = [
  { id: 'gloss', label: 'Вернуть блеск кузову', service: 'light', body: true },
  { id: 'light-scratches', label: 'Убрать мелкие царапины', service: 'restorative', body: true },
  { id: 'defects', label: 'Убрать заметные царапины и дефекты', service: 'deep', body: true },
  { id: 'element', label: 'Отполировать отдельный элемент', service: 'local' },
  { id: 'headlights', label: 'Отполировать фары', service: 'headlights' },
  { id: 'estimate', label: 'Не знаю — нужна оценка' },
] as const

export const polishingProblems = [
  { title: 'Кузов потерял блеск', text: 'Лак выглядит тусклым, цвет — плоским и выцветшим.' },
  { title: 'Мелкие царапины и «паутинка»', text: 'Микроцарапины от моек и щёток, заметные на солнце.' },
  { title: 'Следы эксплуатации', text: 'Потёртости и мелкие дефекты лака от ежедневного использования.' },
  { title: 'Подготовка к продаже', text: 'Ухоженный кузов помогает показать автомобиль в лучшем виде.' },
  { title: 'Дефект на отдельном элементе', text: 'Когда нужна локальная работа, а не полировка всего кузова.' },
  { title: 'Помутневшие фары', text: 'Фары теряют прозрачность и выглядят неухоженно.' },
] as const

export const polishingDepthNote =
  'Глубокие царапины и сколы до грунта или металла полировка может не убрать — что реально исправить, оценим на бесплатном осмотре.'

export const polishingProcess = [
  { title: 'Заявка', text: 'Оставляете модель автомобиля и задачу — менеджер связывается с вами.' },
  { title: 'Бесплатный осмотр', text: 'Оцениваем состояние лакокрасочного покрытия и уточняем задачу.' },
  { title: 'Согласование', text: 'Согласовываем состав работ и стоимость до начала работ.' },
  { title: 'Подготовка', text: 'Моем и очищаем кузов перед полировкой.' },
  { title: 'Полировка', text: 'Выполняем согласованные работы.' },
  { title: 'Выдача автомобиля', text: 'Показываем результат и рассказываем об уходе за кузовом.' },
] as const

/** Only DriveSet-wide facts already confirmed in the project; no wrapping-specific guarantees. */
export const polishingBenefits = [
  '5 лет опыта',
  '3 мастера',
  '41 отзыв',
  'Рейтинг 5.0',
  'Бесплатный осмотр',
  'Запись без предоплаты',
  'Забор и возврат автомобиля',
  'Ответ на заявку до 15 минут в рабочее время',
] as const

export const polishingFaq = [
  {
    question: 'Уберёт ли полировка все царапины?',
    answer: 'Полировка убирает мелкие царапины и следы эксплуатации в слое лака. Глубокие повреждения до грунта или металла полировка может не исправить — это оценим на бесплатном осмотре.',
  },
  {
    question: 'Сколько стоит полировка?',
    answer: 'Ориентировочно — от 2 500 ₽ за локальную полировку элемента до от 60 000 ₽ за глубокую абразивную полировку кузова. Точная стоимость зависит от автомобиля, состояния ЛКП и объёма работ и подтверждается после бесплатного осмотра.',
  },
  { question: 'Нужна ли предоплата?', answer: 'Нет, запись проводится без предоплаты.' },
  { question: 'Можно ли забрать автомобиль и вернуть после работ?', answer: 'Да, DriveSet предлагает забор и возврат автомобиля.' },
  { question: 'Можно ли отполировать только один элемент или фары?', answer: 'Да. Можно сделать локальную полировку отдельных элементов или полировку фар.' },
] as const
