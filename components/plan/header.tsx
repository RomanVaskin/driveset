import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { planNav } from '@/lib/plan-config'
import { site } from '@/lib/site-config'

/**
 * Хедер страницы /plan. Отдельный от лендингового `site/header.tsx`, потому что
 * тот ведёт на якоря главной (`#services`, `#lead`), которых на /plan нет.
 * Без client-JS: на мобильных остаются логотип и ссылка «На сайт».
 */
export function PlanHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 md:h-20 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight md:text-xl"
          aria-label={`${site.name} — на главную`}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Разделы плана">
          {planNav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          На сайт
          <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
