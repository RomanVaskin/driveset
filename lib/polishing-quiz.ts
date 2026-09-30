import { polishingNeeds, polishingPrices, type PolishingNeedId } from '@/lib/polishing-config'

export type PolishingSelectionItem = {
  /** The client's own answer, e.g. «Убрать мелкие царапины». */
  intent: string
  /** Indicative service for that answer; absent for «Не знаю — нужна оценка». */
  serviceTitle?: string
}

/** Ordered like the quiz so the CRM text follows the client's choices. */
export function describePolishingSelection(needIds: readonly PolishingNeedId[]): PolishingSelectionItem[] {
  return polishingNeeds
    .filter((need) => needIds.includes(need.id))
    .map((need) => {
      const service = polishingPrices.find((price) => price.id === need.service)
      return service ? { intent: need.label, serviceTitle: service.title } : { intent: need.label }
    })
}

/** Existing /api/lead field `package`: every chosen answer → service. No prices: the quiz shows none. */
export function polishingLeadFields(items: readonly PolishingSelectionItem[]) {
  return {
    package: `Полировка: ${items.map((item) => (item.serviceTitle ? `${item.intent} → ${item.serviceTitle}` : item.intent)).join('; ')}`,
  }
}
