# OLNOO_PROJECT_MAP.md — DriveSet

Production-карта файлов. Обновлять при любом изменении структуры.

## Точки входа

| Файл | Роль |
| --- | --- |
| `app/layout.tsx` | Root layout: шрифты (Manrope/Inter), `<html lang="ru">`, metadata, viewport, Open Graph, SEO и клиентский bootstrap маркетинга. |
| `app/page.tsx` | Сборка лендинга + JSON-LD (`AutoDetailing`). Один `<h1>` живёт в Hero. |
| `app/globals.css` | Tailwind v4, дизайн-токены премиальной тёмной темы. |
| `app/sitemap.ts` | `/sitemap.xml`: `/`, `/okleyka-avto`, `/polirovka-avto`, `/himchistka-avto` (без `/plan`). |
| `lib/site-config.ts` | **Единый источник контента**: бренд, подтверждённые контакты и часы работы, навигация, услуги, trust-метрики, процесс, настройки/fallback галереи, ссылка на Яндекс Карту. |
| `lib/portfolio-manifest.ts` | Типы и клиентская валидация внешнего manifest галереи. Разрешает только известные категории и URL внутри `/media/portfolio-web/`; `loadPortfolioManifest()` — общий браузерный запрос manifest (используется `/polirovka-avto`). |
| `lib/wrapping-config.ts` | Контент `/okleyka-avto`: пакеты, цены, подарки, плёнки, преимущества, демонстрационный пример трекера, процесс и FAQ. |
| `lib/polishing-config.ts` | Контент `/polirovka-avto`: навигация, внутренние рыночные ориентиры (`polishingMarketBenchmarks`, не выводятся), утверждённая клиентская сетка цен (`polishingPrices`), доп. услуги без цен, ответы квиза со связкой на услугу, проблемы, процесс, преимущества, FAQ. |
| `lib/cleaning-config.ts` | Контент `/himchistka-avto`: навигация, утверждённая сетка цен (`cleaningPrices`, 10 позиций «от», три — «за 1 шт.»), варианты квиза (мультивыбор, «Другое» с уточнением до 60 символов, связь с позицией прайса только при точном совпадении), зоны, процесс, преимущества, FAQ. |
| `lib/cleaning-quiz.ts` | Поле `package` квиза химчистки для `/api/lead` (выбранные ответы, без цен). |
| `lib/polishing-quiz.ts` | Чистые функции квиза полировки: ответ → услуга → ориентир, поля `package`/`displayedPrice` для `/api/lead`. |
| `lib/wrapping-quiz.ts` | Типы состояния и чистый расчёт цены/срока для квиза оклейки (пакет или набор элементов, учёт `promotionEndsAt`). |
| `lib/campaign-attribution.ts` | Клиентский сбор и sessionStorage-персистентность пяти `utm_*` и `yclid` с сохранением первого значения каждого поля. |
| `lib/marketing-events.ts` | Типизированная граница целей Яндекс Метрики с белым списком неперсональных параметров (`package`, `channel`). |
| `lib/lead-submission.ts` | Общий клиентский POST всех форм в `/api/lead`; собирает attribution/pagePath и только после `201 {ok:true}` отправляет цель успеха: по умолчанию `lead_submit`, для `/polirovka-avto` — `polirovka_lead_submit`, для `/himchistka-avto` — `himchistka_lead_submit`. |
| `components/marketing-bootstrap.tsx` | Клиентский сбор атрибуции на всех маршрутах, загрузка Метрики при наличии ID и просмотры страниц App Router. |
| `app/api/lead/route.ts` | Единственный Node.js endpoint заявок: валидация, honeypot, ограничение частоты/дублей в памяти процесса, server-side POST в OLNOO CRM и минимальный ответ браузеру. |

## Секции лендинга (`components/site/`)

Порядок соответствует `app/page.tsx`.

| Компонент | Секция | Тип | Якорь |
| --- | --- | --- | --- |
| `header.tsx` | Хедер, sticky, burger-меню | client | — |
| `hero.tsx` | Hero: фото-poster (mobile) / фоновое видео (внешний URL, только md+), оверлей, `<h1>`, CTA | server | `#top` |
| `services.tsx` | 3 карточки услуг: приоритетная оклейка (PPF/цветная/передняя часть/полный кузов), полировка, химчистка; с 01.10.2026 без цен (поле `price` в `services` остаётся только для `/plan`) и без бейджа «Приоритетное направление» (`featured` задаёт только широкую раскладку); каждая карточка ведёт на свою посадочную | server | `#services` |
| `why-us.tsx` | Блок доверия: опыт, команда, отзывы, рейтинг, часы работы | server | `#about` |
| `process.tsx` | Процесс из 5 шагов | server | — |
| `gallery.tsx` | Серверная оболочка галереи работ | server | `#gallery` |
| `gallery-client.tsx` | Runtime manifest, фильтры «Все / Оклейка / Полировка / Химчистка», группировка «Все» по категориям, lazy-превью фото/видео и полноэкранный просмотр; при недоступном manifest оставляет статичный fallback | client | — |
| `cta.tsx` | CTA-баннер | server | — |
| `contacts.tsx` | Контакты + карта + форма; номер MAX копируется через client-компонент | server | `#contacts` |
| `max-contact.tsx` | Копирование номера MAX и событие `max_click` на главной | client | — |
| `yandex-map.tsx` | Интерактивная Яндекс Карта (iframe map-widget) | server | — |
| `lead-form.tsx` | Форма заявки через `/api/lead`; поля скрыты от записи Вебвизора | client | `#lead` |
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

Для главной (`lib/site-config.ts`, `components/site/hero.tsx`) те же кадры дополнительно
пережаты в WebP (`hero-detailing.webp`, `service-*.webp`, `work-1..4.webp`, thumbnails
уменьшены до 800px) — главная и fallback-галерея используют только `.webp`. Оригинальные
`.png` сохранены и используются `/plan` (`components/plan/*`) и `og:image` в `app/layout.tsx`
(WebP не трогаем там намеренно — другой маршрут вне задачи оптимизации). При
добавлении новых изображений на главную повторять этот же пайплайн (`cwebp -q 80..82 -m 6`,
для миниатюр `-resize 800 800`).

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
`libheif-examples`. Скрипт проверяет их наличие, но ничего не устанавливает. Команда на
production: `pnpm --dir /opt/driveset run media:portfolio`.

## Навигация / якоря

`#services`, `#about`, `#gallery`, `#contacts`, `#lead`, `#top`.
Основной CTA «Рассчитать стоимость» ведёт на `#lead`, вторичный hero CTA — на
`#gallery`. Карточки услуг ведут на свои посадочные (с 01.10.2026): оклейка →
`/okleyka-avto` «Подробнее об оклейке», полировка → `/polirovka-avto` «Подробнее о
полировке», химчистка → `/himchistka-avto` «Подробнее о химчистке». Общая форма
`#lead` на главной остаётся универсальным способом оставить заявку.

## Посадочная `/okleyka-avto`

Отдельная индексируемая страница для трафика Яндекс Директ. Собственный header,
footer, metadata, canonical, Open Graph image и JSON-LD (`Service` + видимый
`FAQPage`). Главную страницу не переиспользует и не меняет.

| Файл | Роль | Тип |
| --- | --- | --- |
| `app/okleyka-avto/page.tsx` | Сборка страницы, route metadata и JSON-LD; `revalidate = 60`, тексты акции зависят от `isPromotionActive()` (`promotionStartsAt`/`promotionEndsAt`) | server |
| `app/okleyka-avto/opengraph-image.tsx` | Маршрутный OG-визуал без stock/AI-автомобиля | server |
| `components/wrapping/header.tsx` | Sticky header и mobile menu | client |
| `components/wrapping/hero.tsx` | H1, ценовые якоря, CTA (включая `photo_calc_click`), trust-факты и реальный poster | server + client media/actions |
| `components/wrapping/packages.tsx`, `promotion.tsx` | Основные пакеты (с 01.10.2026: зоны риска от 50 000 ₽, полная PPF от 150 000 ₽, матовая PPF от 150 000 ₽, цветная от 150 000 ₽) и акция −10 000 ₽ на полную PPF 01.10–15.10.2026 | server |
| `components/wrapping/quiz.tsx` | С 01.10.2026 lead-форма без показа цены: автомобиль → услуга (зоны риска / полная PPF / цветная) → подарок (только полная PPF, один из `gifts`) → контакт «Остался последний шаг» (канал телефон/Telegram/MAX, CTA «Получить расчёт + подарок» / «Получить расчёт») → «Заявка отправлена»; логика в `lib/wrapping-quiz.ts`; свободный ввод скрыт от записи Вебвизора; цели `quiz_start`, `car_selected`, `package_selected`, `quiz_phone`, `lead_submit` | client |
| `components/wrapping/contact-actions.tsx` | Telegram/телефон; MAX копирует подтверждённый номер без выдуманного URL и отмечает клик; CTA по фото отмечает `photo_calc_click`; WhatsApp скрыт из UI | client |
| `components/wrapping/works.tsx`, `works-client.tsx` | Только runtime `category=wrapping`; WebP posters lazy, MP4 только после открытия | server + client |
| `components/wrapping/tracker-preview.tsx` | Статический коммерческий пример будущего персонального онлайн-трекера после преимуществ; без ссылки и backend | server |
| `components/wrapping/new-car.tsx`, `films.tsx`, `benefits.tsx`, `process.tsx`, `element-prices.tsx` (перечень отдельных элементов без цен), `reviews.tsx`, `faq.tsx`, `final-cta.tsx` | Остальные коммерческие и информационные секции | server (вложенные contact actions — client) |
| `components/wrapping/footer.tsx` | Контакты и навигация страницы | server |

Якоря: `#top`, `#packages`, `#calculator`, `#works`, `#process`, `#photo-calc`.
Квиз — lead-форма: с 01.10.2026 рассчитанная цена не показывается; заявка уходит в CRM через
`/api/lead` (телефон + выбранный канал телефон/Telegram/MAX, автомобиль, пакет, подарок для полной PPF, строка акции,
если была показана; без имени лид в CRM называется «Заявка DriveSet»); прямые каналы связи остаются отдельными
действиями. `lead_submit` срабатывает только после успешного ответа API. До production-запуска сбора ПД нужны утверждённая
Privacy Policy и согласие у обеих форм.

## Посадочная `/polirovka-avto`

Отдельная индексируемая страница под Яндекс Директ (с 29.09.2026). Технически
переиспользует секции оклейки через props (header, footer, процесс,
преимущества, FAQ, финальный CTA, контакты), но без их текстов и коммерческой
механики; без props эти секции рендерят `/okleyka-avto` как прежде.

| Файл | Роль | Тип |
| --- | --- | --- |
| `components/landing/service-quiz.tsx` | Общий квиз посадочных услуг: модель → мультивыбор (правила выбора, опциональное «Другое» с текстом, опциональный ориентир цены рядом с выбранным вариантом) → только телефон → заменяемый блок результата; воронка `<prefix>_*` с защитой от дублей | client |
| `components/landing/sections.tsx` | Общие секции: `LandingHero`, `CardGrid`, `PriceList` (сетка цен `#prices`, опциональная единица «за 1 шт.» и доп. услуги), `TrustStrip` (`trustStats`), `LandingContacts` | server |
| `components/landing/portfolio-works.tsx` | «Результаты наших работ» для одной категории production manifest (lazy превью, без автозапуска, без подписей «до/после»; без работ не рендерится) | client |
| `app/polirovka-avto/page.tsx` | Сборка страницы, metadata, canonical, OG и JSON-LD (`Service` + `FAQPage`) | server |
| `app/polirovka-avto/opengraph-image.tsx` | Текстовый OG-визуал без цен | server |
| `components/polishing/sections.tsx` | Hero и проблемы через общие секции, сетка цен `#prices` (5 цен «от» + оговорка + доп. услуги без цен), контакты | server |
| `components/polishing/quiz.tsx` | Обёртка `ServiceQuiz`: модель → «Что хотите получить?» (с 01.10.2026 независимый множественный выбор) → только телефон → `PolishingQuizResult`; цена в квизе не показывается | client |
| `components/polishing/quiz-result.tsx` | Экран после успешной заявки; заменяемый блок для будущей механики цены | server-safe |

Якоря: `#top`, `#calculator`, `#problems`, `#prices`, `#works`, `#process`, `#contacts`, `#photo-calc`.
Сетка цен (с 01.10.2026): локальная полировка элемента от 2 500 ₽, фары от 3 500 ₽,
лёгкая полировка кузова от 10 000 ₽, восстановительная от 20 000 ₽, глубокая
абразивная от 30 000 ₽ — ориентиры, не окончательная цена.
В CRM: `vehicleModel`, `package` = «Полировка: <ответ> → <услуга>; …» (все выбранные ответы),
`displayedPrice` = ориентиры выбранных услуг через « + » (для «Не знаю — нужна
оценка» цена не передаётся), телефон,
UTM, yclid, `pagePath=/polirovka-avto`; `/api/lead` ставит `service=polirovka-avto`.
Цели Метрики: только `polirovka_*` (см. `OLNOO_ARCHITECTURE.md`).
Работы: `PortfolioWorks category="polishing"`.

## Посадочная `/himchistka-avto`

Отдельная индексируемая страница под Яндекс Директ (с 30.09.2026) на общих
landing-компонентах; `/okleyka-avto` и `/polirovka-avto` не меняются.

| Файл | Роль | Тип |
| --- | --- | --- |
| `app/himchistka-avto/page.tsx` | Сборка: hero (`/images/service-cleaning.webp`) → квиз → `TrustStrip` → «Что можно очистить» → «Стоимость химчистки» → работы `dry-cleaning` → процесс → преимущества → FAQ → контакты → финальный CTA; metadata, canonical, OG, JSON-LD | server |
| `app/himchistka-avto/opengraph-image.tsx` | Текстовый OG-визуал без цен | server |
| `components/cleaning/quiz.tsx` | «Модель автомобиля» → «Что нужно сделать?» (мультивыбор, «Другое» + текст) → «Получите расчёт стоимости химчистки» | client |
| `components/cleaning/quiz-result.tsx` | Экран после успешной заявки: подтверждение и фото салона в Telegram/MAX (существующие каналы); заменяемый блок для будущей механики цены | server-safe |

Якоря: `#top`, `#calculator`, `#zones`, `#prices`, `#works`, `#process`, `#contacts`, `#photo-calc`.
Сетка цен `#prices` (с 30.09.2026, `PriceList` как у полировки): комплексная
химчистка салона от 10 000 ₽; одно сиденье от 1 000 ₽ за 1 шт.; потолок от 2 500 ₽;
пол / ковровое покрытие от 2 500 ₽; багажник от 1 500 ₽; одна дверная карта от
700 ₽ за 1 шт.; панель / пластик от 1 000 ₽; один ворсовый коврик от 300 ₽ за 1 шт.;
руль от 1 500 ₽; озонирование салона от 1 500 ₽. С 01.10.2026 карточка химчистки на главной
показывается без цены. С 01.10.2026 в квизе цен нет (прайс на странице остаётся).
В CRM: `vehicleModel`, `package` = «Химчистка салона — выбрано: <ответы через запятую, для «Другое» — «Другое: <текст>»>»,
телефон, UTM, yclid, `pagePath=/himchistka-avto`; `/api/lead` ставит `service=himchistka-avto`.
Цели Метрики: только `himchistka_*`.

## Конфиг

| Файл | Назначение |
| --- | --- |
| `next.config.mjs` | Images unoptimized + security headers. |
| `.env.production` | Публичный ID реального счётчика Метрики через `NEXT_PUBLIC_YANDEX_METRIKA_ID`; Next.js встраивает значение при production build. |
| Server-only env | `OLNOO_CRM_URL` (база `https://admin.olnoo.com`) и `OLNOO_CRM_API_KEY` для `/api/lead`; значения не должны попадать в `NEXT_PUBLIC_*` или Git. |

## Деплой (production, REG.RU)

| Факт | Значение |
| --- | --- |
| Домен | `driveset.ru` |
| Сервер | REG.RU VPS (IP не хранится в документации — см. GitHub Secret `SERVER_HOST`) |
| Путь на сервере | `/opt/driveset` |
| systemd-сервис | `driveset.service` |
| Порт | `3230` |
| Ветка деплоя | `main` |
| Package manager | `pnpm` (via `corepack enable`) |
| Workflow | `.github/workflows/deploy.yml`, триггер — push в `main` |
| GitHub Secrets | `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY` |

Деплой: `git fetch` + `git reset --hard origin/main` → `pnpm install --frozen-lockfile`
→ `pnpm build` → `systemctl restart driveset.service` → проверка `is-active` и
`curl http://127.0.0.1:3230`.

Production перенесён с прежнего KZ-сервера (`213.155.29.140`,
`/opt/olnoo/projects/driveset`) на REG.RU в 2026-09; secrets обновлены, путь на
сервере поменялся, остальной процесс деплоя не изменился.
