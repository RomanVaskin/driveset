import { ImageResponse } from 'next/og'

export const alt = 'DriveSet — оклейка автомобиля полиуретановой плёнкой в Москве'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#222224', color: '#f4f1eb', padding: '72px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>DriveSet</div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
        <div style={{ display: 'flex', color: '#d7bd8a', fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Москва · PPF</div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 64, lineHeight: 1.06, fontWeight: 800, letterSpacing: '-0.04em' }}>Оклейка автомобиля полиуретановой плёнкой</div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 28, color: '#b9b6b0' }}>Передняя часть от 85 000 ₽ · полный кузов от 190 000 ₽ по акции</div>
      </div>
    </div>,
    size,
  )
}
