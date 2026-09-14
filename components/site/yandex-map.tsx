import { yandexMapSrc, site } from '@/lib/site-config'

/**
 * Интерактивная адаптивная Яндекс Карта через официальный map-widget.
 * Виджет полностью интерактивный (зум, перемещение, маршруты) и не требует API-ключа.
 */
export function YandexMap() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-xl border border-border md:h-full md:min-h-[420px]">
      <iframe
        src={yandexMapSrc}
        title={`Карта: ${site.address}`}
        loading="lazy"
        allowFullScreen
        className="h-full w-full border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
