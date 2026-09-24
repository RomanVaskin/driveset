export const attributionKeys = ['utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'] as const

export type AttributionKey = (typeof attributionKeys)[number]
export type CampaignAttribution = Partial<Record<AttributionKey, string>>

const storageKey = 'driveset_campaign_attribution'
const maxValueLength = 200

function cleanValue(value: string | null) {
  return value?.trim().slice(0, maxValueLength) || undefined
}

export function captureCampaignAttribution(): CampaignAttribution {
  if (typeof window === 'undefined') return {}

  const previous = readCampaignAttribution()
  const params = new URLSearchParams(window.location.search)
  const incoming: CampaignAttribution = {}

  for (const key of attributionKeys) {
    const value = cleanValue(params.get(key))
    if (value) incoming[key] = value
  }

  const result = Object.keys(previous).length > 0 ? previous : incoming

  if (Object.keys(result).length > 0) {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(result))
    } catch {
      // Storage can be unavailable in privacy modes; attribution remains in component state.
    }
  }

  return result
}

export function readCampaignAttribution(): CampaignAttribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(storageKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const result: CampaignAttribution = {}
    for (const key of attributionKeys) {
      if (typeof parsed[key] === 'string') result[key] = cleanValue(parsed[key] as string)
    }
    return result
  } catch {
    return {}
  }
}
