import type { LeadDraft } from '@/lib/lead-submission'
import {
  gifts,
  isPromotionActive,
  promotionBadge,
  wrappingPackages,
  type GiftId,
  type QuizPackageId,
} from '@/lib/wrapping-config'

/**
 * The quiz is a lead form, not a calculator: it collects what the manager needs
 * for a personal quote and never shows a computed price.
 */
export type QuizAnswers = {
  /** Free text as typed by the user, e.g. «Geely Monjaro» or «Monjaro». */
  car: string
  packageId: QuizPackageId | ''
  giftId: GiftId | ''
}

export const initialQuizAnswers: QuizAnswers = {
  car: '',
  packageId: '',
  giftId: '',
}

/** Gifts belong to full PPF only; zones of risk and colour wrap never get one. */
export function hasGiftStep(packageId: QuizAnswers['packageId']) {
  return packageId === 'full-ppf'
}

/** The −10 000 ₽ promotion is independent of the gift: full PPF and its date window only. */
export function showsPromotion(packageId: QuizAnswers['packageId'], now: Date = new Date()) {
  return packageId === 'full-ppf' && isPromotionActive(now)
}

export function selectedGift(answers: QuizAnswers) {
  return hasGiftStep(answers.packageId) ? gifts.find((item) => item.id === answers.giftId) : undefined
}

/** CRM fields of a quiz lead; `displayedPrice` carries only the promotion line actually shown. */
export function quizLeadFields(answers: QuizAnswers, now: Date = new Date()): Pick<LeadDraft, 'vehicleModel' | 'package' | 'gift' | 'displayedPrice'> {
  return {
    vehicleModel: answers.car,
    package: wrappingPackages.find((item) => item.id === answers.packageId)?.title,
    gift: selectedGift(answers)?.title,
    displayedPrice: showsPromotion(answers.packageId, now) ? promotionBadge : undefined,
  }
}
