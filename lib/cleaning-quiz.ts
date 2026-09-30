import { cleaningNeeds, type CleaningNeedId } from '@/lib/cleaning-config'

/**
 * Existing /api/lead fields. The quiz shows no prices (the public price list
 * stays on the page), so only the chosen answers go to the CRM.
 */
export function cleaningLeadFields(ids: readonly CleaningNeedId[], otherText: string) {
  const answers = cleaningNeeds
    .filter((need) => ids.includes(need.id))
    .map((need) => (need.id === 'other' && otherText ? `${need.label}: ${otherText}` : need.label))
  return { package: `Химчистка салона — выбрано: ${answers.join(', ')}` }
}
