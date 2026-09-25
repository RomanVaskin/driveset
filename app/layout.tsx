import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Inter } from 'next/font/google'
import { Suspense } from 'react'
import { site } from '@/lib/site-config'
import { MarketingBootstrap } from '@/components/marketing-bootstrap'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'DriveSet — оклейка, полировка и химчистка автомобилей в Москве',
    template: '%s — DriveSet',
  },
  description: site.description,
  generator: 'v0.app',
  keywords: [
    'детейлинг',
    'химчистка автомобиля',
    'полировка кузова',
    'оклейка автомобиля',
    'PPF плёнка',
    'детейлинг Москва',
    'DriveSet',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: site.url,
    siteName: site.name,
    title: 'DriveSet — оклейка, полировка и химчистка автомобилей в Москве',
    description: site.description,
    images: [{ url: '/images/hero-detailing.png', width: 1200, height: 630, alt: 'DriveSet — детейлинг-центр в Москве' }],
  },
  alternates: { canonical: site.url },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f7f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Suspense fallback={null}><MarketingBootstrap /></Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
