# OLNOO_ARCHITECTURE.md — DriveSet

Архитектурные решения. Обновлять при изменении системных фактов.

## Обзор

Статический лендинг на Next.js App Router. Server Components по умолчанию;
клиентские — только там, где нужна интерактивность (`header`, `lead-form`).
Backend нет — по замыслу этапа 1.

## Ключевые решения

1. **Контент отделён от разметки.** Всё в `lib/site-config.ts`
   (типизировано). Компоненты только рендерят. Это готовит почву под
   будущие per-service страницы, калькулятор и квиз без переписывания.
2. **Дизайн-токены в `globals.css`** (Tailwind v4 `@theme inline`). Тёмная
   графитовая тема, акцент — шампань/платина (`--primary`). Менять палитру
   только здесь.
3. **Секции — независимые компоненты** в `components/site/`. Добавление/
   перестановка секции = правка `app/page.tsx`.
4. **Яндекс Карта** — официальный `map-widget/v1` через `<iframe>`.
   Интерактивная, адаптивная, без API-ключа. Запрос адреса формируется в
   `site-config.ts` (`yandexMapSrc`).
5. **Форма заявки** — frontend-only, локальный success-state. Точка
   расширения помечена комментарием в `lead-form.tsx`.

6. **Внутренняя страница `/plan`.** Отдельный маршрут `app/plan/page.tsx` со
   своими `components/plan/*` и контентом в `lib/plan-config.ts` (тот же принцип
   «контент отдельно от разметки»). Свой хедер/футер, потому что лендинговый
   хедер использует якоря главной. Закрыта через `metadata.robots`
   (`noindex, nofollow`); canonical переопределён на `/plan` (иначе наследуется
   от layout и указывает на главную). Sitemap в проекте нет, поэтому исключать
   нечего; `Disallow` в robots.txt намеренно не добавляем — он мешает краулеру
   увидеть `noindex`. Страница описывает будущие функции, но не реализует их.

7. **Hero-видео.** Фон hero — обычный `<video autoPlay muted loop playsInline>`
   (без JS, hero остаётся server-компонентом) с внешним URL
   `https://driveset.ru/media/hero-optimized.mp4`; MP4 в репозиторий не кладём. Под видео
   лежит `next/image` с `hero-detailing.png` (он же `poster`): виден, пока видео
   грузится, если autoplay заблокирован или файл недоступен. При
   `prefers-reduced-motion: reduce` видео скрывается CSS (`motion-reduce:hidden`),
   остаётся статичное фото. Читаемость текста держит тёмный оверлей в `hero.tsx`;
   при смене ролика проверять контраст заново.

## Деплой

Автодеплой по push в `main`: `.github/workflows/deploy.yml` подключается по SSH
к production-серверу (KZ, secrets `SERVER_HOST`/`SERVER_USER`/`SERVER_SSH_KEY`),
обновляет код (`git reset --hard origin/main`), пересобирает (`pnpm install
--frozen-lockfile` + `pnpm build`) и перезапускает `driveset.service`, затем
проверяет `systemctl is-active` и `curl http://127.0.0.1:3230`. Актуальные
production-факты (сервер, путь, порт) — в `OLNOO_PROJECT_MAP.md`, не здесь.

## SEO groundwork

- Один `<h1>` (Hero). Иерархия `<h2>/<h3>` по секциям.
- `metadata` + Open Graph в `layout.tsx`; canonical на `driveset.ru`.
- JSON-LD `AutoDetailing` в `app/page.tsx`.
- Все изображения с осмысленным `alt`, `lang="ru"`.

## Точки расширения (этап 2+)

| Задача | Куда встраивать |
| --- | --- |
| Backend формы / Telegram-уведомления | `lead-form.tsx` (`handleSubmit`) → Route Handler `app/api/lead`. |
| Отдельные страницы услуг | `app/services/[slug]/page.tsx`, данные из `services` в `site-config.ts`. |
| Калькулятор / квиз | Новые роуты + client-компоненты, конфиг услуг переиспользуется. |
| CRM / аналитика | Обработчик Route Handler + provider в `layout.tsx`. |
| Реальные контакты | Заменить placeholders в `site-config.ts`. |

## Ограничения / инварианты

- `next.config.mjs` содержит `typescript.ignoreBuildErrors: true` — `pnpm build`
  ошибки типов **не ловит**. Перед коммитом запускай `npx tsc --noEmit`.
- Рабочая директория на production-сервере совпадает с путём `driveset.service`:
  `pnpm build` в ней перезаписывает `.next` живого сайта. Проверочные сборки —
  в копии проекта вне этой директории.
- Не добавлять backend, оплату, CRM, личный кабинет на этапе 1.
- Держать 3–5 цветов и ≤2 шрифта.
- Не выдумывать реальные контактные данные — только placeholders.
- Mobile-first; без горизонтального скролла; карта не ломает layout.
