/**
 * Central site configuration for DriveSet.
 * Keep all brand, contact, navigation and service data here so future stages
 * (SEO pages, calculator, quiz, CRM, per-service routes) can extend the site
 * without rewriting components.
 */

export const site = {
  name: 'DriveSet',
  domain: 'driveset.ru',
  url: 'https://driveset.ru',
  tagline: 'Оклейка, полировка и химчистка автомобилей в Москве',
  description:
    'DriveSet — оклейка, полировка и химчистка автомобилей в Москве. Ул. Наташи Ковшовой, 4с2.',
  city: 'Москва',
  address: 'Москва, улица Наташи Ковшовой, 4с2',
  addressShort: 'ул. Наташи Ковшовой, 4с2',
  phone: '+7 901 344-77-33',
  phoneHref: 'tel:+79013447733',
  workHours: 'Ежедневно 10:00–22:00',
  telegram: '@driveset',
  telegramHref: 'https://t.me/driveset',
  whatsapp: '+7 901 344-77-33',
  whatsappHref: 'https://wa.me/79013447733',
  max: 'MAX',
  maxPhone: '+7 901 344-77-33',
  /** Демонстрационный номер только для мокапа на внутренней странице /plan. */
  planPhoneExample: '+7 (000) 000-00-00',
} as const

export type NavLink = { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'Услуги', href: '#services' },
  { label: 'О сервисе', href: '#about' },
  { label: 'Работы', href: '#gallery' },
  { label: 'Контакты', href: '#contacts' },
]

export type Service = {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
  price: string
  features?: readonly string[]
  href: string
  cta: string
  featured?: boolean
}

export const services: Service[] = [
  {
    id: 'wrapping',
    title: 'Оклейка автомобиля',
    description:
      'Защищаем заводское покрытие или полностью меняем образ автомобиля качественными плёнками.',
    image: '/images/service-wrapping.png',
    imageAlt: 'Процесс оклейки кузова автомобиля защитной PPF-плёнкой в DriveSet',
    price: 'от 20 000 ₽',
    features: ['Защитная PPF', 'Цветная оклейка', 'Передняя часть', 'Полный кузов'],
    href: '/okleyka-avto',
    cta: 'Подробнее об оклейке',
    featured: true,
  },
  {
    id: 'polishing',
    title: 'Полировка кузова',
    description:
      'Восстановление блеска кузова и устранение мелких царапин и дефектов ЛКП.',
    image: '/images/service-polishing.png',
    imageAlt: 'Процесс профессиональной полировки кузова автомобиля в DriveSet',
    price: 'от 10 000 ₽',
    href: '#lead',
    cta: 'Рассчитать стоимость',
  },
  {
    id: 'cleaning',
    title: 'Химчистка салона',
    description:
      'Глубокая очистка салона, удаление загрязнений, пятен и посторонних запахов.',
    image: '/images/service-cleaning.png',
    imageAlt: 'Профессиональная химчистка салона автомобиля в детейлинг-центре DriveSet',
    price: 'от 5 000 ₽',
    href: '#lead',
    cta: 'Рассчитать стоимость',
  },
]

export type TrustStat = { value: string; label: string }

export const trustStats: TrustStat[] = [
  { value: '5', label: 'лет опыта' },
  { value: '3', label: 'мастера' },
  { value: '41', label: 'отзыв' },
  { value: '5.0', label: 'рейтинг' },
  { value: '10:00–22:00', label: 'ежедневно' },
]

export type ProcessStep = { step: string; title: string; description: string }

export const processSteps: ProcessStep[] = [
  { step: '01', title: 'Заявка', description: 'Оставляете заявку удобным способом.' },
  { step: '02', title: 'Осмотр автомобиля', description: 'Оцениваем состояние и объём работ.' },
  { step: '03', title: 'Согласование работ', description: 'Подбираем услуги и время.' },
  { step: '04', title: 'Выполнение', description: 'Выполняем работы аккуратно и в срок.' },
  { step: '05', title: 'Выдача автомобиля', description: 'Возвращаем автомобиль в идеальном виде.' },
]

export type GalleryItem = { image: string; alt: string }

export const portfolioManifestUrl = '/media/portfolio-web/manifest.json'

export const galleryCategoryLabels = {
  wrapping: 'Оклейка',
  polishing: 'Полировка',
  'dry-cleaning': 'Химчистка',
} as const

/** Fallback shown while the external portfolio manifest is unavailable. */
export const galleryItems: GalleryItem[] = [
  { image: '/images/work-1.png', alt: 'Полированный кузов автомобиля с глубоким блеском — работа DriveSet' },
  { image: '/images/work-2.png', alt: 'Чистый салон автомобиля после химчистки в DriveSet' },
  { image: '/images/work-3.png', alt: 'Премиальный автомобиль после оклейки защитной плёнкой в DriveSet' },
  { image: '/images/work-4.png', alt: 'Детейлинг передней части автомобиля после полировки в DriveSet' },
]

/** Yandex Maps interactive widget query (адаптивный интерактивный виджет без API-ключа). */
export const yandexMapSrc =
  'https://yandex.ru/map-widget/v1/?text=' +
  encodeURIComponent('Москва, улица Наташи Ковшовой, 4с2') +
  '&z=16'
