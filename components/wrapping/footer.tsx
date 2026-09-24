import Link from 'next/link'
import { site } from '@/lib/site-config'

export function WrappingFooter() {
  return (
    <footer className="section-dark border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-start sm:justify-between lg:px-8">
        <div>
          <Link href="/" className="font-display text-lg font-extrabold">{site.name}</Link>
          <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
          <p className="mt-1 text-sm text-muted-foreground">{site.workHours}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Навигация в подвале">
          <a href="#packages" className="text-sm text-muted-foreground hover:text-foreground">Пакеты</a>
          <a href="#calculator" className="text-sm text-muted-foreground hover:text-foreground">Расчёт</a>
          <a href="#works" className="text-sm text-muted-foreground hover:text-foreground">Работы</a>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Главная</Link>
        </nav>
      </div>
      <div className="border-t border-border"><div className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground lg:px-8">© {site.name} 2026</div></div>
    </footer>
  )
}
