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

/** Existing /api/lead fields: `package` carries intent → service, `displayedPrice` the matching «от» prices. */
export function polishingLeadFields(items: readonly PolishingSelectionItem[]) {
  const prices = items.flatMap((item) => (item.priceLabel ? [item.priceLabel] : []))
  return {
    package: `Полировка: ${items.map((item) => (item.serviceTitle ? `${item.intent} → ${item.serviceTitle}` : item.intent)).join('; ')}`,
    displayedPrice: prices.length > 0 ? prices.join(' + ') : undefined,
  }
}
