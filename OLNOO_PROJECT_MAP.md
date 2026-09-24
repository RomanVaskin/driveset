# OLNOO_PROJECT_MAP.md — DriveSet

Production-карта файлов. Обновлять при любом изменении структуры.

## Точки входа

| Файл | Роль |
| --- | --- |
| `app/layout.tsx` | Root layout: шрифты (Manrope/Inter), `<html lang="ru">`, metadata, viewport, Open Graph, SEO. |
| `app/page.tsx` | Сборка лендинга + JSON-LD (`AutoDetailing`). Один `<h1>` живёт в Hero. |
| `app/globals.css` | Tailwind v4, дизайн-токены премиальной тёмной темы. |
| `lib/site-config.ts` | **Единый источник контента**: бренд, подтверждённые контакты и часы работы, навигация, услуги, trust-метрики, процесс, настройки/fallback галереи, ссылка на Яндекс Карту. |
| `lib/portfolio-manifest.ts` | Типы и клиентская валидация внешнего manifest галереи. Разрешает только известные категории и URL внутри `/media/portfolio-web/`. |
| `lib/wrapping-config.ts` | Подтверждённый контент `/okleyka-avto`: пакеты, цены, подарки, плёнки, преимущества, процесс и FAQ. |
| `lib/wrapping-quiz.ts` | Типы состояния и чистый расчёт предварительной цены/срока для квиза оклейки. |
| `lib/campaign-attribution.ts` | Клиентский сбор и sessionStorage-персистентность `utm_*`/`yclid`. |
| `lib/marketing-events.ts` | Типизированная граница событий Яндекс Метрики; без `NEXT_PUBLIC_YANDEX_METRIKA_ID` ничего не отправляет. |

## Секции лендинга (`components/site/`)

Порядок соответствует `app/page.tsx`.

| Компонент | Секция | Тип | Якорь |
| --- | --- | --- | --- |
| `header.tsx` | Хедер, sticky, burger-меню | client | — |
| `hero.tsx` | Hero: фото-poster (mobile) / фоновое видео (внешний URL, только md+), оверлей, `<h1>`, CTA | server | `#top` |
| `services.tsx` | 3 карточки услуг: приоритетная оклейка (PPF/цветная/передняя часть/полный кузов), полировка, химчистка | server | `#services` |
| `why-us.tsx` | Блок доверия: опыт, команда, отзывы, рейтинг, часы работы | server | `#about` |
| `process.tsx` | Процесс из 5 шагов | server | — |
| `gallery.tsx` | Серверная оболочка галереи работ | server | `#gallery` |
| `gallery-client.tsx` | Runtime manifest, фильтры «Все / Оклейка / Полировка / Химчистка», группировка «Все» по категориям, lazy-превью фото/видео и полноэкранный просмотр; при недоступном manifest оставляет статичный fallback | client | — |
| `cta.tsx` | CTA-баннер | server | — |
| `contacts.tsx` | Контакты + карта + форма | server | `#contacts` |
| `yandex-map.tsx` | Интерактивная Яндекс Карта (iframe map-widget) | server | — |
| `lead-form.tsx` | Форма заявки (frontend-only) | client | `#lead` |
| `footer.tsx` | Подвал | server | — |

## Внутренняя страница `/plan`

Стратегия развития (продвижение → автоматизация → AI → этапы → KPI).
`noindex, nofollow`, canonical `/plan`, в sitemap не входит (sitemap.xml и
robots.txt в проекте отсутствуют). Лендинговые компоненты не затронуты.

| Файл | Роль |
| --- | --- |
| `app/plan/page.tsx` | Сборка страницы + `metadata` (robots noindex, canonical, OG). |
| `lib/plan-config.ts` | Весь контент `/plan`. Цены — из `services`; демонстрационный телефон будущего CRM-потока отделён от реального контакта главной. |
| `components/plan/header.tsx`, `footer.tsx` | Свои хедер/футер: лендинговый `site/header.tsx` ведёт на якоря главной, на `/plan` их нет. |
| `components/plan/plan-section.tsx` | `PlanSection` (отступы/eyebrow/h2 как на лендинге), `IconBadge`, `GroupLabel`. |
| `components/plan/flow-chain.tsx` | Цепочка шагов со стрелками (вертикальная на мобильных, горизонтальная на lg+). |
| `components/plan/hero.tsx`, `promotion.tsx`, `automation.tsx`, `car-card.tsx`, `ai.tsx`, `roadmap.tsx`, `kpi.tsx`, `final-chain.tsx` | Секции по порядку на странице. Якоря: `#promotion`, `#automation`, `#car`, `#ai`, `#roadmap`, `#kpi`, `#system`. |

Все компоненты `/plan` — server, client-JS нет. Новых изображений нет: используются
существующие из `public/images/`.

## Изображения (`public/images/`)

`hero-detailing.png` (также poster/fallback hero-видео), `service-cleaning.png`, `service-polishing.png`,
`service-wrapping.png`, `work-1..4.png`. Все сгенерированы, alt заданы в
`lib/site-config.ts` и компонентах.

## Медиа вне репозитория

Hero-видео `https://driveset.ru/media/hero-optimized.mp4` отдаёт nginx на production
(файл лежит на сервере, **в git его нет**, `public/media/` не создаём). URL
захардкожен константой `heroVideoSrc` в `components/site/hero.tsx`. Если файла
нет или он не грузится — виден poster `/images/hero-detailing.png`.

Portfolio-оригиналы находятся на production в
`/opt/olnoo/media/driveset/portfolio/{wrapping,polishing,dry-cleaning}/`.
Производные и `manifest.json` создаются вне Git в
`/opt/olnoo/media/driveset/portfolio-web/` и доступны сайту по URL
`/media/portfolio-web/`. Галерея загружает manifest в браузере без пересборки
Next.js; до успешной загрузки использует `work-1..4.png`.

## Media pipeline

| Файл | Роль |
| --- | --- |
| `scripts/process-portfolio-media.mjs` | Рекурсивно и идемпотентно готовит WebP/MP4/poster, проверяет производные, изолирует пофайловые ошибки и атомарно пишет manifest/state. Оригиналы только читает. |
| `package.json` → `media:portfolio` | Запуск pipeline с production-путями по умолчанию. Для локальной проверки скрипт принимает `--input`, `--output`, `--public-base`. |

Системные утилиты: `ffmpeg`/`ffprobe` и `cwebp` (Ubuntu-пакет `webp`); для
встреченных HEIC дополнительно `heif-convert` из Ubuntu-пакета
`libheif-examples`. Скрипт проверяет их наличие, но ничего не устанавливает. Команда на KZ:
`pnpm --dir /opt/olnoo/projects/driveset run media:portfolio`.

## Навигация / якоря

`#services`, `#about`, `#gallery`, `#contacts`, `#lead`, `#top`.
Основной CTA «Рассчитать стоимость» ведёт на `#lead`, вторичный hero CTA — на
`#gallery`. Карточка оклейки ведёт на будущий маршрут `/okleyka-avto` (маршрут на
этапе 1 создан как отдельная frontend-only посадочная).

## Посадочная `/okleyka-avto`

Отдельная индексируемая страница для трафика Яндекс Директ. Собственный header,
footer, metadata, canonical, Open Graph image и JSON-LD (`Service` + видимый
`FAQPage`). Главную страницу не переиспользует и не меняет.

| Файл | Роль | Тип |
| --- | --- | --- |
| `app/okleyka-avto/page.tsx` | Сборка страницы, route metadata и JSON-LD | server |
| `app/okleyka-avto/opengraph-image.tsx` | Маршрутный OG-визуал без stock/AI-автомобиля | server |
| `components/wrapping/header.tsx` | Sticky header и mobile menu | client |
| `components/wrapping/hero.tsx` | H1, ценовые якоря, CTA, trust-факты и реальный poster | server + client media |
| `components/wrapping/packages.tsx`, `promotion.tsx` | Основные пакеты и акция полного кузова PPF | server |
| `components/wrapping/quiz.tsx` | 5 шагов → цена до контакта → один подарок → каналы связи | client |
| `components/wrapping/contact-actions.tsx` | Telegram/WhatsApp/телефон; MAX копирует подтверждённый номер без выдуманного URL | client |
| `components/wrapping/works.tsx`, `works-client.tsx` | Только runtime `category=wrapping`; WebP posters lazy, MP4 только после открытия | server + client |
| `components/wrapping/new-car.tsx`, `films.tsx`, `benefits.tsx`, `process.tsx`, `element-prices.tsx`, `reviews.tsx`, `faq.tsx`, `final-cta.tsx` | Остальные коммерческие и информационные секции | server (вложенные contact actions — client) |
| `components/wrapping/footer.tsx` | Контакты и навигация страницы | server |

Якоря: `#top`, `#packages`, `#calculator`, `#works`, `#process`, `#photo-calc`.
Предварительный расчёт работает полностью в браузере. Формы отправки и
`app/api/lead` пока нет; `lead_submit` зарезервирован только для будущего
успешного ответа API.

## Конфиг

| Файл | Назначение |
| --- | --- |
| `next.config.mjs` | Images unoptimized + security headers. |

## Деплой (production, KZ)

| Факт | Значение |
| --- | --- |
| Домен | `driveset.ru` |
| Сервер | `213.155.29.140` |
| Путь на сервере | `/opt/olnoo/projects/driveset` |
| systemd-сервис | `driveset.service` |
| Порт | `3230` |
| Ветка деплоя | `main` |
| Package manager | `pnpm` (via `corepack enable`) |
| Workflow | `.github/workflows/deploy.yml`, триггер — push в `main` |
| GitHub Secrets | `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY` |

Деплой: `git fetch` + `git reset --hard origin/main` → `pnpm install --frozen-lockfile`
→ `pnpm build` → `systemctl restart driveset.service` → проверка `is-active` и
`curl http://127.0.0.1:3230`.
