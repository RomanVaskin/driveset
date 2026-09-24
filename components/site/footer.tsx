import { site } from '@/lib/site-config'

export function Footer() {
  return (
    <footer className="section-dark border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between lg:px-8">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight">{site.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
          <a href={site.phoneHref} className="mt-2 inline-block text-sm text-foreground transition-colors hover:text-champagne">{site.phone}</a>
        </div>

        <nav className="flex gap-8" aria-label="Навигация в подвале">
          <a href="#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Услуги
          </a>
          <a href="#contacts" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Контакты
          </a>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-5 lg:px-8">
          <p className="text-xs text-muted-foreground">© {site.name} 2026</p>
        </div>
      </div>
    </footer>
  )
}
