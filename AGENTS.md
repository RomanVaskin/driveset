# AGENTS.md — DriveSet

Рабочие правила для агентов, дорабатывающих проект DriveSet.

## Что это

Премиальный лендинг автомобильного сервиса и детейлинг-центра DriveSet
(домен `driveset.ru`, Москва, ул. Наташи Ковшовой, 4с2).

Текущий статус: **Этап 1 — визуальный MVP-лендинг (frontend-only).**

## Прежде чем менять код

1. Прочитай `OLNOO_PROJECT_MAP.md` — карта файлов и секций.
2. Прочитай `OLNOO_ARCHITECTURE.md` — архитектурные решения и точки расширения.
3. Если изменение меняет системные факты (структура, стек, точки расширения,
   контактные данные, услуги), **обнови обе карты в том же commit**.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (токены в `app/globals.css`, без `tailwind.config`)
- shadcn-совместимая база

## Принципы дизайна (не нарушать)

- premium automotive, minimal, clean, technical, confident.
- Тёмная графитовая база + один спокойный акцент (шампань/платина).
- Максимум 3–5 цветов, максимум 2 шрифта (Manrope дисплей + Inter текст).
- Запрещено: кислотные цвета, обилие красного, неон, дешёвые градиенты,
  карбон, гоночные клетки, спидометры, тюнинг-клише, визуальный шум.

## Границы этапа 1 (НЕ реализовывать сейчас)

Калькулятор, квизы, CRM, сложные формы, SEO-страницы, личный кабинет,
онлайн-оплата, сложные интеграции, backend для формы.

`/plan` — внутренний стратегический документ (noindex, вне sitemap). Он
*описывает* будущие функции (CRM, квиз, AI и т.д.), но не реализует их: границы
этапа 1 остаются в силе.

## Данные

Весь контент (услуги, навигация, контакты, процесс, галерея, карта) живёт
в `lib/site-config.ts`. Меняй контент там, а не в компонентах.
Контент внутренней страницы `/plan` живёт отдельно — в `lib/plan-config.ts`.
Реальные контакты пока — placeholders; не выдумывать номера/данные.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
