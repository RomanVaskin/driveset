export const portfolioCategories = ['wrapping', 'polishing', 'dry-cleaning'] as const

export type PortfolioCategory = (typeof portfolioCategories)[number]

export type PortfolioImage = {
  category: PortfolioCategory
  type: 'image'
  src: string
  thumb: string
  originalFilename: string
}

export type PortfolioVideo = {
  category: PortfolioCategory
  type: 'video'
  src: string
  poster: string
  originalFilename: string
}

export type PortfolioItem = PortfolioImage | PortfolioVideo

const mediaBase = '/media/portfolio-web/'

function isSafeMediaPath(
  value: unknown,
  extension: '.webp' | '.mp4',
  category: PortfolioCategory,
): value is string {
  if (typeof value !== 'string') return false
  try {
    const decoded = decodeURIComponent(value)
    return value.startsWith(`${mediaBase}${category}/`)
      && value.toLowerCase().endsWith(extension)
      && !decoded.includes('..')
      && !/[\\?#]/.test(value)
  } catch {
    return false
  }
}

function isCategory(value: unknown): value is PortfolioCategory {
  return typeof value === 'string'
    && portfolioCategories.includes(value as PortfolioCategory)
}

function parseItem(value: unknown): PortfolioItem | null {
  if (!value || typeof value !== 'object') return null
  const item = value as Record<string, unknown>
  if (!isCategory(item.category)
    || typeof item.originalFilename !== 'string'
    || item.originalFilename.length === 0
    || /[\\/]/.test(item.originalFilename)) return null

  if (item.type === 'image'
    && isSafeMediaPath(item.src, '.webp', item.category)
    && isSafeMediaPath(item.thumb, '.webp', item.category)) {
    return {
      category: item.category,
      type: 'image',
      src: item.src,
      thumb: item.thumb,
      originalFilename: item.originalFilename,
    }
  }

  if (item.type === 'video'
    && isSafeMediaPath(item.src, '.mp4', item.category)
    && isSafeMediaPath(item.poster, '.webp', item.category)) {
    return {
      category: item.category,
      type: 'video',
      src: item.src,
      poster: item.poster,
      originalFilename: item.originalFilename,
    }
  }

  return null
}

export function parsePortfolioManifest(value: unknown): PortfolioItem[] {
  if (!value || typeof value !== 'object') return []
  const manifest = value as { version?: unknown; items?: unknown }
  if (manifest.version !== 1 || !Array.isArray(manifest.items)) return []
  return manifest.items.map(parseItem).filter((item): item is PortfolioItem => item !== null)
}
