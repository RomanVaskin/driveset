import { polishingNeeds, polishingPrices, type PolishingNeedId } from '@/lib/polishing-config'

export type PolishingSelectionItem = {
  /** The client's own answer, e.g. «Убрать мелкие царапины». */
  intent: string
  /** Indicative service for that answer; absent for «Не знаю — нужна оценка». */
  serviceTitle?: string
  priceLabel?: string
}

/** Ordered like the quiz so CRM text and prices stay aligned. */
export function describePolishingSelection(needIds: readonly PolishingNeedId[]): PolishingSelectionItem[] {
  return polishingNeeds
    .filter((need) => needIds.includes(need.id))
    .map((need) => {
      const service = polishingPrices.find((price) => price.id === need.service)
      return service ? { intent: need.label, serviceTitle: service.title, priceLabel: service.priceLabel } : { intent: need.label }
    })
}

/**
 * Next selection after a tap: whole-body levels replace each other,
 * «Не знаю — нужна оценка» replaces everything, any other answer drops it.
 */
export function togglePolishingNeed(current: readonly PolishingNeedId[], id: PolishingNeedId): PolishingNeedId[] {
  if (current.includes(id)) return current.filter((item) => item !== id)
  const need = polishingNeeds.find((item) => item.id === id)
  if (id === 'estimate') return [id]
  const bodyIds = polishingNeeds.filter((item) => item.body).map((item) => item.id)
  return [...current.filter((item) => item !== 'estimate' && !(need?.body && bodyIds.includes(item))), id]
}

/** Existing /api/lead fields: `package` carries intent → service, `displayedPrice` the matching «от» prices. */
export function polishingLeadFields(items: readonly PolishingSelectionItem[]) {
  const prices = items.flatMap((item) => (item.priceLabel ? [item.priceLabel] : []))
  return {
    package: `Полировка: ${items.map((item) => (item.serviceTitle ? `${item.intent} → ${item.serviceTitle}` : item.intent)).join('; ')}`,
    displayedPrice: prices.length > 0 ? prices.join(' + ') : undefined,
  }
}
