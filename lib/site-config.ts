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
  tagline: 'Подготовка и уход за автомобилем',
  description:
    'DriveSet — профессиональная химчистка, полировка и оклейка автомобилей в Москве. Ул. Наташи Ковшовой, 4с2.',
  city: 'Москва',
  address: 'Москва, улица Наташи Ковшовой, 4с2',
  addressShort: 'ул. Наташи Ковшовой, 4с2',
  // Placeholders — заполнить реальными данными на следующем этапе.
  phonePlaceholder: '+7 (000) 000-00-00',
  workHoursPlaceholder: 'Ежедневно, по записи',
  telegramPlaceholder: '@driveset',
  whatsappPlaceholder: '+7 (000) 000-00-00',
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
}

export const services: Service[] = [
  {
    id: 'cleaning',
    title: 'Химчистка',
    description:
      'Глубокая очистка салона, удаление загрязнений, пятен и запахов.',
    image: '/images/service-cleaning.png',
    imageAlt: 'Профессиональная химчистка салона автомобиля в детейлинг-центре DriveSet',
    price: 'от 5 000 ₽',
  },
  {
    id: 'polishing',
    title: 'Полировка',
    description:
      'Восстановление блеска кузова и устранение мелких царапин и дефектов ЛКП.',
    image: '/images/service-polishing.png',
    imageAlt: 'Процесс профессиональной полировки кузова автомобиля в DriveSet',
    price: 'от 10 000 ₽',
  },
  {
    id: 'wrapping',
    title: 'Оклейка',
    description:
      'Защитная и декоративная оклейка автомобиля качественными автомобильными плёнками.',
    image: '/images/service-wrapping.png',
    imageAlt: 'Процесс оклейки кузова автомобиля защитной PPF-плёнкой в DriveSet',
    price: 'от 9 000 ₽',
  },
]

export type Advantage = { title: string }

export const advantages: Advantage[] = [
  { title: 'Профессиональные материалы' },
  { title: 'Опытные мастера' },
  { title: 'Аккуратная работа' },
  { title: 'Работаем по записи' },
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
