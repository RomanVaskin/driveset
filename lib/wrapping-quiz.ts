import {
  elementPrices,
  isPromotionActive,
  wrappingPackages,
  otherElementsOption,
  type ElementPriceId,
  type QuizPackageId,
} from '@/lib/wrapping-config'

export type QuizElementId = ElementPriceId | typeof otherElementsOption.id

export type QuizAnswers = {
  /** Free text as typed by the user, e.g. «Geely Monjaro» or «Monjaro». */
  car: string
  packageId: QuizPackageId | ''
  elementIds: QuizElementId[]
}

export type QuoteResult = {
  packageTitle: string
  priceLabel: string | null
  promo: boolean
  duration: string
  /** Selected elements with their own price; null price = confirmed after inspection. */
  items?: readonly { title: string; priceLabel: string | null }[]
}

export const initialQuizAnswers: QuizAnswers = {
  car: '',
  packageId: '',
  elementIds: [],
}

function rub(value: number) {
  return `от ${value.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`
}

export function getQuoteResult(answers: QuizAnswers, now: Date = new Date()): QuoteResult | null {
  if (!answers.packageId) return null

  if (answers.packageId === 'elements') {
    if (answers.elementIds.length === 0) return null
    const priced = elementPrices.filter((item) => answers.elementIds.includes(item.id))
    const hasOther = answers.elementIds.includes(otherElementsOption.id)
    const items = [
      ...priced.map(({ title, priceLabel }) => ({ title, priceLabel })),
      ...(hasOther ? [{ title: otherElementsOption.title, priceLabel: null }] : []),
    ]
    return {
      packageTitle: `Отдельные элементы: ${items.map((item) => item.title).join(', ')}`,
      // A total is only honest when every selected element has a confirmed price.
      priceLabel: priced.length > 0 && !hasOther ? rub(priced.reduce((sum, item) => sum + item.price, 0)) : null,
      promo: false,
      duration: 'Подтвердим после бесплатного осмотра',
      items,
    }
  }

  const selectedPackage = wrappingPackages.find((item) => item.id === answers.packageId)
  if (!selectedPackage) return null

  return {
    packageTitle: selectedPackage.title,
    priceLabel: selectedPackage.priceLabel,
    // The −10 000 ₽ promotion is shown next to the price and only for full PPF.
    promo: selectedPackage.id === 'full-ppf' && isPromotionActive(now),
    duration: selectedPackage.duration,
  }
}
