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

- Не добавлять backend, оплату, CRM, личный кабинет на этапе 1.
- Держать 3–5 цветов и ≤2 шрифта.
- Не выдумывать реальные контактные данные — только placeholders.
- Mobile-first; без горизонтального скролла; карта не ломает layout.
