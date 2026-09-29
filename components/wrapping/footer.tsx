import Link from 'next/link'
import { site } from '@/lib/site-config'

const defaultLinks = [
  { label: 'Пакеты', href: '#packages' },
  { label: 'Расчёт', href: '#calculator' },
  { label: 'Работы', href: '#works' },
] as const

export function WrappingFooter({ links = defaultLinks }: { links?: readonly { label: string; href: string }[] } = {}) {
  return (
    <footer className="section-dark border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-start sm:justify-between lg:px-8">
        <div>
          <Link href="/" className="font-display text-lg font-extrabold">{site.name}</Link>
          <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
          <p className="mt-1 text-sm text-muted-foreground">{site.workHours}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Навигация в подвале">
          {links.map((item) => <a key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">{item.label}</a>)}
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Главная</Link>
        </nav>
      </div>
      <div className="border-t border-border"><div className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground lg:px-8">© {site.name} 2026</div></div>
    </footer>
  )
}
