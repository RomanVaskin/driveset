import Link from 'next/link'
import { site } from '@/lib/site-config'

export function PlanFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="text-sm text-muted-foreground">
          Внутренний стратегический документ {site.name}. Страница закрыта от индексации.
        </p>
        <Link href="/" className="text-sm font-semibold text-primary transition-opacity hover:opacity-80">
          Вернуться на сайт
        </Link>
      </div>
    </footer>
  )
}
