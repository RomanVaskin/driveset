'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site-config'
import { wrappingNav } from '@/lib/wrapping-config'

export function WrappingHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors ${solid ? 'border-border bg-background/90 shadow-soft backdrop-blur-xl' : 'border-transparent bg-graphite text-white'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 lg:px-8">
        <Link href="/" className={`font-display text-lg font-extrabold tracking-tight ${solid ? 'text-foreground' : 'text-white'}`}>
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Навигация страницы оклейки">
          {wrappingNav.map((item) => (
            <a key={item.href} href={item.href} className={`text-sm transition-colors ${solid ? 'text-muted-foreground hover:text-foreground' : 'text-white/75 hover:text-white'}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#calculator" className={`hidden rounded-md px-5 py-2.5 text-sm font-semibold md:inline-flex ${solid ? 'bg-primary text-primary-foreground' : 'bg-white text-graphite'}`}>
          Рассчитать стоимость
        </a>

        <button type="button" onClick={() => setOpen((value) => !value)} className={`flex size-10 items-center justify-center rounded-md border md:hidden ${solid ? 'border-border text-foreground' : 'border-white/25 text-white'}`} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Мобильная навигация страницы оклейки">
            {wrappingNav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-foreground hover:bg-secondary">
                {item.label}
              </a>
            ))}
            <a href="#calculator" onClick={() => setOpen(false)} className="mt-2 rounded-md bg-primary px-4 py-3.5 text-center font-semibold text-primary-foreground">
              Рассчитать стоимость
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
