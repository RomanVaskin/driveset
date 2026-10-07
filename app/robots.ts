import type { MetadataRoute } from 'next'
import { site } from '@/lib/site-config'

/**
 * The public site is open to crawlers. No `Disallow` on purpose: /plan is closed with `noindex` in its metadata, and a Disallow
 * would stop crawlers from seeing that noindex. The sitemap is the existing app/sitemap.ts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
