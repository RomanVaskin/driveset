/**
 * Контент внутренней страницы `/plan` (стратегия развития DriveSet).
 * Как и `site-config.ts`, держим данные отдельно от разметки: компоненты
 * в `components/plan/` только рендерят. Цены берём из `services`, контакты —
 * из `site` (placeholders), чтобы не выдумывать данные.
 */

import {
  Car,
  CalendarCheck,
  Clapperboard,
  Coins,
  Database,
  FileText,
  Flag,
  Globe,
  History,
  Inbox,
  ListChecks,
  MapPin,
  Megaphone,
  Receipt,
  Repeat2,
  Route,
  Search,
  Send,
  Sparkles,
  Star,
  Store,
  Tag,
  Target,
  TrendingUp,
  UserRound,
  WandSparkles,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { services, site } from './site-config'

/** Цена «от …» из карточки услуги — единственный источник цифр в мокапах. */
export const polishingPrice = services.find((s) => s.id === 'polishing')?.price ?? ''

export type FlowStep = {
  label: string
  icon: LucideIcon
  note?: string
  chips?: readonly string[]
  thumbs?: readonly { src: string; alt: string }[]
}

export type PlanNavLink = { label: string; href: string }

export const planNav: PlanNavLink[] = [
  { label: 'Продвижение', href: '#promotion' },
  { label: 'Автоматизация', href: '#automation' },
  { label: 'AI', href: '#ai' },
  { label: 'Этапы', href: '#roadmap' },
  { label: 'KPI', href: '#kpi' },
]

/* ---------------------------------- HERO ---------------------------------- */

export const planHero = {
  title: 'План развития DriveSet',
  subtitle: ['Привлечение клиентов', 'автоматизация', 'повторные продажи'],
  lead: 'Цель — построить систему, которая не просто приводит заявки, а доводит клиента от первого контакта до повторного визита.',
} as const

export const journey: FlowStep[] = [
  { label: 'Трафик', icon: Globe, note: 'Карты, Директ, SEO' },
  { label: 'Заявка', icon: Inbox, note: 'Форма, квиз, звонок' },
  { label: 'CRM', icon: Database, note: 'Клиент и авто' },
  { label: 'Запись', icon: CalendarCheck, note: 'Дата и время' },
  { label: 'Услуга', icon: Sparkles, note: 'Выполнение работ' },
  { label: 'Отзыв', icon: Star, note: 'Автозапрос' },
  { label: 'Повторный визит', icon: Repeat2, note: 'Напоминание' },
]

/* -------------------------------- ПРОДВИЖЕНИЕ ------------------------------- */

export type Channel = {
  id: string
  title: string
  /** Роль канала в воронке — коротко, зачем он нужен. */
  role: string
  icon: LucideIcon
  points: readonly string[]
}

export const channels: Channel[] = [
  {
    id: 'maps',
    title: 'Яндекс Карты',
    role: 'Горячий спрос',
    icon: MapPin,
    points: ['Карточка компании', 'Фото', 'Отзывы', 'Услуги', 'Локальное продвижение'],
  },
  {
    id: 'direct',
    title: 'Яндекс Директ',
    role: 'Горячий спрос',
    icon: Target,
    points: ['Полировка', 'Химчистка', 'Оклейка', 'Отдельные кампании по услугам'],
  },
  {
    id: 'seo',
    title: 'SEO',
    role: 'Накопительный эффект',
    icon: Search,
    points: ['Отдельные страницы услуг', 'Запросы по маркам', 'Локальные запросы'],
  },
  {
    id: 'avito',
    title: 'Авито',
    role: 'Готовый трафик',
    icon: Store,
    points: ['Отдельные объявления по услугам', 'Тест офферов'],
  },
  {
    id: 'social',
    title: 'Соцсети',
    role: 'Доверие и прогрев',
    icon: Clapperboard,
    points: ['До / после', 'Процесс', 'Кейсы', 'Reels / Shorts / VK Клипы'],
  },
  {
    id: 'retargeting',
    title: 'Ретаргетинг',
    role: 'Возврат интереса',
    icon: Repeat2,
    points: ['Возвращать посетителей сайта', 'Реклама конкретной услуги'],
  },
]

export const promotionFlow: FlowStep[] = [
  { label: 'Источники', icon: Megaphone, chips: ['Яндекс', 'Карты', 'Авито', 'Соцсети'] },
  {
    label: 'Страница услуги',
    icon: FileText,
    note: 'Отдельная на каждую услугу',
    thumbs: services.map((s) => ({ src: s.image, alt: s.title })),
  },
  { label: 'Форма / квиз', icon: ListChecks, chips: ['Форма', 'Квиз', 'Звонок'] },
  { label: 'CRM', icon: Database, note: 'Источник и UTM сохраняются' },
  { label: 'Запись', icon: CalendarCheck, note: 'Свободный слот' },
]

/* -------------------------------- АВТОМАТИЗАЦИЯ ----------------------------- */

export const quizSteps = [
  { label: 'Машина', state: 'done' },
  { label: 'Услуга', state: 'done' },
  { label: 'Зона работ', state: 'done' },
  { label: 'Ориентировочная стоимость', state: 'current', hint: `Полировка — ${polishingPrice}` },
  { label: 'Получение контакта', state: 'pending' },
] as const

export const telegramFields: ReadonlyArray<readonly [string, string]> = [
  ['Авто', 'Zeekr 001'],
  ['Услуга', 'Полировка'],
  ['Телефон', site.phonePlaceholder],
  ['Источник', 'Яндекс Директ'],
  ['UTM', 'utm_campaign=polish'],
]

export const bookingDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'] as const
export const bookingActiveDay = 'Ср'
export const bookingSlots = [
  { time: '10:00', busy: true },
  { time: '12:00' },
  { time: '14:00', active: true },
  { time: '16:00' },
] as const

export const crmStatuses = ['Новая', 'Расчёт', 'Записан', 'В работе', 'Выдан'] as const
export const crmActiveStatus = 'Записан'

export const crmFields: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: 'Клиент', icon: UserRound },
  { label: 'Автомобиль', icon: Car },
  { label: 'Марка / модель', icon: Tag },
  { label: 'Услуга', icon: Wrench },
  { label: 'Источник', icon: Route },
  { label: 'Сумма', icon: Wallet },
  { label: 'Статус', icon: ListChecks },
  { label: 'История работ', icon: History },
]

export const followUpSteps = [
  { label: 'Клиент получил расчёт и пропал', icon: FileText },
  { label: 'Напоминание менеджеру', icon: Flag, tag: 'Сначала' },
  { label: 'Сообщение клиенту', icon: Send, tag: 'Позже, автоматически' },
] as const

export const afterService: FlowStep[] = [
  { label: 'Выдача авто', icon: Car, note: 'Работа выполнена' },
  { label: 'Запрос отзыва', icon: Star, note: 'Автоматически' },
  { label: '+3 месяца', icon: Repeat2, note: 'Напоминание' },
  { label: '+6 месяцев', icon: Repeat2, note: 'Напоминание' },
  { label: '+12 месяцев', icon: Repeat2, note: 'Напоминание' },
]

/* ---------------------------- КАРТОЧКА АВТОМОБИЛЯ --------------------------- */

export const carCard = {
  model: 'Zeekr 001',
  client: 'Иван',
  mileage: '18 400 км',
  history: [
    { date: '20.09', work: 'Полировка' },
    { date: '20.09', work: 'Керамика' },
  ],
  next: { when: 'через 6 месяцев', what: 'проверка покрытия' },
  idea: 'CRM должна хранить не только клиента, но и сам автомобиль как отдельную сущность.',
  benefits: [
    'Один клиент — несколько автомобилей',
    'История работ привязана к машине, а не к телефону',
    'Система сама знает, когда напомнить о следующем визите',
  ],
} as const

/* ----------------------------------- AI ------------------------------------ */

export const aiContentOutputs = ['Пост', 'Описание кейса', 'Reels caption', 'SEO-текст'] as const

/* ---------------------------------- ЭТАПЫ ---------------------------------- */

export type Stage = {
  name: string
  items: readonly string[]
  /** Критерий готовности — условие старта следующего этапа. */
  done: string
}

export const stages: Stage[] = [
  {
    name: 'Основа',
    items: ['Сайт', 'Метрика', 'Карты', 'Форма', 'Telegram', 'CRM'],
    done: 'Каждая заявка видна в CRM вместе с источником',
  },
  {
    name: 'Трафик',
    items: ['Яндекс Директ', 'Авито', 'Страницы услуг'],
    done: 'Известна цена заявки и записи по каждому каналу',
  },
  {
    name: 'Конверсия',
    items: ['Квиз', 'Калькулятор', 'Follow-up', 'Отзывы'],
    done: 'Расчёты не теряются, отзывы приходят автоматически',
  },
  {
    name: 'AI',
    items: ['AI-консультант', 'AI-фото', 'AI-контент'],
    done: 'Клиент получает первый ответ сразу, ручной рутины меньше',
  },
  {
    name: 'Возврат',
    items: ['Полная CRM автомобиля', 'Повторные продажи'],
    done: 'Повторные визиты приходят по напоминаниям',
  },
]

/* ----------------------------------- KPI ----------------------------------- */

export type Kpi = { label: string; formula: string; source: string; icon: LucideIcon }

export const kpis: Kpi[] = [
  { label: 'Заявки', formula: 'Все обращения за неделю: форма, звонки, мессенджеры', source: 'Метрика + CRM', icon: Inbox },
  { label: 'Запись', formula: 'Записались ÷ оставили заявку', source: 'CRM', icon: CalendarCheck },
  { label: 'Доезд', formula: 'Приехали ÷ записались', source: 'CRM', icon: Route },
  { label: 'Стоимость лида', formula: 'Расход на рекламу ÷ заявки', source: 'Директ + CRM', icon: Coins },
  { label: 'Средний чек', formula: 'Выручка ÷ выполненные заказы', source: 'CRM', icon: Receipt },
  { label: 'Повторный визит', formula: 'Доля клиентов, вернувшихся за 12 месяцев', source: 'CRM', icon: Repeat2 },
  { label: 'Выручка по источнику', formula: 'Оплаченные заказы, сгруппированные по каналу и UTM', source: 'CRM + UTM', icon: TrendingUp },
]

export const kpiRule =
  'Каналы оцениваем по выручке, а не по цене заявки: дешёвый лид, который не приехал, дороже дорогого, который стал клиентом.'

/* ------------------------------ ФИНАЛЬНАЯ СХЕМА ----------------------------- */

export const systemStages = [
  { label: 'Привлечение', icon: Megaphone },
  { label: 'Лид', icon: Inbox },
  { label: 'Запись', icon: CalendarCheck },
  { label: 'Услуга', icon: Sparkles },
  { label: 'Повторная продажа', icon: Repeat2 },
] as const

export const systemLayers = [
  {
    label: 'CRM',
    icon: Database,
    text: 'Единая память о клиенте и автомобиле',
    chips: ['Клиент', 'Автомобиль', 'Источник', 'История работ'],
  },
  {
    label: 'AI',
    icon: WandSparkles,
    text: 'Помощник на каждом шаге',
    chips: ['Консультант', 'Анализ фото', 'Контент', 'Follow-up'],
  },
] as const

export const systemLoop = 'Повторная продажа возвращает клиента сразу на «Запись» — без затрат на рекламу.'
export const systemCaption =
  'DriveSet должен работать как единая система привлечения, обслуживания и возврата клиента.'
