import { cleaningNeeds, cleaningPrices, type CleaningNeedId } from '@/lib/cleaning-config'

/** Price row linked to a quiz answer, if any (see `cleaningNeeds`). */
export function cleaningPriceFor(id: CleaningNeedId) {
  const service = cleaningNeeds.find((need) => need.id === id)?.service
  return cleaningPrices.find((price) => price.id === service)
}

/**
 * Existing /api/lead fields, same scheme as /polirovka-avto: `package` carries
 * answer → price row, `displayedPrice` the «от» prices shown next to those answers.
 */
export function cleaningLeadFields(ids: readonly CleaningNeedId[], otherText: string) {
  const items = cleaningNeeds
    .filter((need) => ids.includes(need.id))
    .map((need) => {
      const price = cleaningPriceFor(need.id)
      const intent = need.id === 'other' && otherText ? `${need.label}: ${otherText}` : need.label
      return { text: price ? `${intent} → ${price.title}` : intent, priceLabel: price?.priceLabel }
    })
  const prices = items.flatMap((item) => (item.priceLabel ? [item.priceLabel] : []))
  return {
    package: `Химчистка: ${items.map((item) => item.text).join('; ')}`,
    displayedPrice: prices.length > 0 ? prices.join(' + ') : undefined,
  }
}
