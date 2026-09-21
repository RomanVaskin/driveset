'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { navLinks, site } from '@/lib/site-config'

export function Header() {
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

  // Наверху шапка прозрачная поверх тёмного hero — светлый текст.
  // После скролла — светлая стеклянная подложка поверх светлой страницы — графитовый текст.
  const solid = scrolled || open

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        solid
          ? 'border-border bg-background/85 backdrop-blur-xl shadow-soft'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 lg:px-8">
        <a
          href="#top"
          className={`font-display text-lg font-extrabold tracking-tight transition-colors md:text-xl ${
            solid ? 'text-foreground' : 'text-white'
          }`}
          aria-label={`${site.name} — на главную`}
        >
          {site.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                solid
                  ? 'text-muted-foreground hover:text-foreground'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#lead"
            className={`hidden rounded-md px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 md:inline-flex ${
              solid
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-[oklch(0.2_0.01_264)]'
            }`}
          >
            Записаться
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors md:hidden ${
              solid
                ? 'border-border text-foreground'
                : 'border-white/30 text-white'
            }`}
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4" aria-label="Мобильная навигация">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#lead"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-primary px-3 py-3.5 text-center text-base font-semibold text-primary-foreground"
            >
              Записаться
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
