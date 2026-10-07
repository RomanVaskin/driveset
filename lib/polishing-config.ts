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
  { id: 'light', title: 'Лёгкая полировка кузова', priceLabel: 'от 10 000 ₽' },
  { id: 'restorative', title: 'Восстановительная полировка кузова', priceLabel: 'от 20 000 ₽' },
  { id: 'deep', title: 'Глубокая абразивная полировка', priceLabel: 'от 30 000 ₽' },
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
 * deliberately has no service and no price. Independent multi-select: any
 * answers can be combined.
 */
export const polishingNeeds: readonly { id: PolishingNeedId; label: string; service?: PolishingServiceId }[] = [
  { id: 'gloss', label: 'Вернуть блеск кузову', service: 'light' },
  { id: 'light-scratches', label: 'Убрать мелкие царапины', service: 'restorative' },
  { id: 'defects', label: 'Убрать заметные царапины и дефекты', service: 'deep' },
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

/**
 * «Виды работ»: descriptions are taken from the approved price grid and the quiz mapping above (answer → service); the
 * classification is indicative, not a diagnosis of the paint — the suitable option is confirmed at the free inspection.
 */
export const polishingTypes = [
  { title: 'Лёгкая полировка кузова', text: 'Возвращает блеск и глубину цвета лаку. Цена — от 10 000 ₽.' },
  { title: 'Восстановительная полировка кузова', text: 'Для мелких царапин и «паутинки» в слое лака. Цена — от 20 000 ₽.' },
  { title: 'Глубокая абразивная полировка', text: 'Для заметных царапин и дефектов лака. Цена — от 30 000 ₽.' },
  { title: 'Локальная полировка элемента', text: 'Когда дефект только на одном элементе кузова и полировать весь автомобиль не нужно. Цена — от 2 500 ₽.' },
  { title: 'Полировка фар', text: 'Подходит, когда фары помутнели и потеряли прозрачность. Цена — от 3 500 ₽.' },
  { title: 'Другие работы', text: 'Капот и крыша, полировка стекла, подготовка кузова, полировка после свежей покраски, керамическое покрытие — стоимость рассчитываем индивидуально.' },
] as const

export const polishingTypesNote = 'Подходящий вариант зависит от состояния ЛКП — подскажем на бесплатном осмотре. Деление на виды ориентировочное и не является диагнозом покрытия.'

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
    answer: 'Ориентировочно — от 2 500 ₽ за локальную полировку элемента до от 30 000 ₽ за глубокую абразивную полировку кузова. Точная стоимость зависит от автомобиля, состояния ЛКП и объёма работ и подтверждается после бесплатного осмотра.',
  },
  {
    question: 'Какие бывают виды полировки кузова?',
    answer: 'В DriveSet — лёгкая полировка для блеска и глубины цвета, восстановительная для мелких царапин, глубокая абразивная для заметных дефектов лака и локальная полировка отдельного элемента. Какой вариант нужен вашему автомобилю, подскажем на бесплатном осмотре.',
  },
  { question: 'Сколько стоит полировка фар?', answer: 'Полировка фар — от 3 500 ₽. Точная стоимость зависит от автомобиля и состояния фар и подтверждается после бесплатного осмотра.' },
  { question: 'Нужна ли полировка фар?', answer: 'Полировка фар подходит, если фары помутнели и потеряли прозрачность. Что нужно именно вашим фарам, оценим на бесплатном осмотре.' },
  {
    question: 'Делаете ли полировку после покраски и керамическое покрытие?',
    answer: 'Да, полировка после свежей покраски и керамическое покрытие входят в наши дополнительные работы. Стоимость рассчитываем индивидуально после осмотра автомобиля.',
  },
  {
    question: 'Можно ли отполировать стёкла автомобиля?',
    answer: 'Полировка стекла есть среди наших дополнительных работ. Фиксированной цены для неё в прайсе нет — возможность работы и стоимость определим на бесплатном осмотре.',
  },
  { question: 'Нужна ли предоплата?', answer: 'Нет, запись проводится без предоплаты.' },
  { question: 'Можно ли забрать автомобиль и вернуть после работ?', answer: 'Да, DriveSet предлагает забор и возврат автомобиля.' },
  { question: 'Можно ли отполировать только один элемент или фары?', answer: 'Да. Можно сделать локальную полировку отдельных элементов или полировку фар.' },
] as const
