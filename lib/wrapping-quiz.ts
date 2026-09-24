import {
  elementPrices,
  wrappingPackages,
  type ElementPriceId,
  type GiftId,
  type WrappingPackageId,
} from '@/lib/wrapping-config'
import type { CampaignAttribution } from '@/lib/campaign-attribution'

export type QuizAnswers = {
  brand: string
  model: string
  year: string
  packageId: WrappingPackageId | ''
  elementId: ElementPriceId | ''
  timing: string
  giftId: GiftId | ''
}

export type QuoteResult = {
  packageTitle: string
  priceLabel: string | null
  regularPriceLabel?: string
  duration: string
  comparison?: readonly { title: string; priceLabel: string }[]
}

/** Client draft for the future POST /api/lead contract. The server must add project=driveset. */
export type LeadSubmissionDraft = {
  attribution: CampaignAttribution
  car: { brand: string; model: string; year: string }
  package: string
  preliminaryPrice: string | null
  desiredTiming: string
  gift: string
  contact: { channel: 'telegram' | 'whatsapp' | 'max' | 'phone'; value: string }
}

export const initialQuizAnswers: QuizAnswers = {
  brand: '',
  model: '',
  year: '',
  packageId: '',
  elementId: '',
  timing: '',
  giftId: '',
}

export function getQuoteResult(answers: QuizAnswers): QuoteResult | null {
  if (!answers.packageId) return null

  if (answers.packageId === 'unknown') {
    return {
      packageTitle: 'Нужна рекомендация',
      priceLabel: null,
      duration: 'Зависит от выбранного варианта',
      comparison: wrappingPackages.map(({ title, priceLabel }) => ({ title, priceLabel })),
    }
  }

  if (answers.packageId === 'elements') {
    const element = elementPrices.find((item) => item.id === answers.elementId)
    if (!element) return null
    return {
      packageTitle: element.title,
      priceLabel: element.priceLabel,
      duration: 'Подтвердим после бесплатного осмотра',
    }
  }

  const selectedPackage = wrappingPackages.find((item) => item.id === answers.packageId)
  if (!selectedPackage) return null

  return {
    packageTitle: selectedPackage.title,
    priceLabel: selectedPackage.priceLabel,
    regularPriceLabel: selectedPackage.regularPriceLabel,
    duration: selectedPackage.duration,
  }
}
