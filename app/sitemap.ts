import type { MetadataRoute } from 'next'
import { site } from '@/lib/site-config'

/** Public indexable pages only; /plan stays out (noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/okleyka-avto', '/polirovka-avto'].map((path) => ({ url: `${site.url}${path}` }))
}
