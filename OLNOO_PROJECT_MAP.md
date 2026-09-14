# OLNOO_PROJECT_MAP.md — DriveSet

Production-карта файлов. Обновлять при любом изменении структуры.

## Точки входа

| Файл | Роль |
| --- | --- |
| `app/layout.tsx` | Root layout: шрифты (Manrope/Inter), `<html lang="ru">`, metadata, viewport, Open Graph, SEO. |
| `app/page.tsx` | Сборка лендинга + JSON-LD (`AutoDetailing`). Один `<h1>` живёт в Hero. |
| `app/globals.css` | Tailwind v4, дизайн-токены премиальной тёмной темы. |
| `lib/site-config.ts` | **Единый источник контента**: бренд, контакты, навигация, услуги, процесс, галерея, ссылка на Яндекс Карту. |

## Секции лендинга (`components/site/`)

Порядок соответствует `app/page.tsx`.

| Компонент | Секция | Тип | Якорь |
| --- | --- | --- | --- |
| `header.tsx` | Хедер, sticky, burger-меню | client | — |
| `hero.tsx` | Hero c фото, `<h1>`, CTA | server | `#top` |
| `services.tsx` | 3 карточки услуг | server | `#services` |
| `why-us.tsx` | «Почему DriveSet», 4 преимущества | server | `#about` |
| `process.tsx` | Процесс из 5 шагов | server | — |
| `gallery.tsx` | Галерея работ | server | `#gallery` |
| `cta.tsx` | CTA-баннер | server | — |
| `contacts.tsx` | Контакты + карта + форма | server | `#contacts` |
| `yandex-map.tsx` | Интерактивная Яндекс Карта (iframe map-widget) | server | — |
| `lead-form.tsx` | Форма заявки (frontend-only) | client | `#lead` |
| `footer.tsx` | Подвал | server | — |

## Изображения (`public/images/`)

`hero-detailing.png`, `service-cleaning.png`, `service-polishing.png`,
`service-wrapping.png`, `work-1..4.png`. Все сгенерированы, alt заданы в
`lib/site-config.ts` и компонентах.

## Навигация / якоря

`#services`, `#about`, `#gallery`, `#contacts`, `#lead`, `#top`.
CTA «Записаться» везде ведёт на `#lead`.

## Конфиг

| Файл | Назначение |
| --- | --- |
| `next.config.mjs` | Images unoptimized + security headers. |
