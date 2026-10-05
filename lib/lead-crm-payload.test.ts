import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCrmLeadBody, crmService, type CrmLeadInput } from './lead-crm-payload.ts'

const UUID = '0b6f4c1e-5d4a-4f0e-9a3b-7c2d1e8f9a10'
const input: CrmLeadInput = {
  name: '', phone: '+79990001122', contactChannel: 'phone', vehicleMake: 'BMW', vehicleModel: 'X5', vehicleYear: '2021', package: 'PPF', displayedPrice: '', gift: '', timing: '',
  utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: '714796268', utm_content: '1922', utm_term: 'ppf', pagePath: '/okleyka-avto',
}

test('a request without any new field produces exactly the body the CRM got before A2', () => {
  assert.deepEqual(buildCrmLeadBody(input, {}), {
    project: 'driveset', name: 'Заявка DriveSet', phone: '+79990001122', source: 'Ads', service: 'okleyka-avto', pagePath: '/okleyka-avto',
    utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: '714796268', utm_content: '1922', utm_term: 'ppf',
    message: 'Канал: phone\nАвтомобиль: BMW X5 2021\nУслуга: PPF',
  })
})

test('valid analytics identifiers are forwarded under the names the CRM inbound accepts', () => {
  const body = buildCrmLeadBody(input, {
    lead_tracking_id: UUID, metrika_client_id: '18446744073709551615', yclid: '555', first_seen_at: '2026-10-04T18:00:00.000Z',
    landing_page: 'https://driveset.ru/okleyka-avto?utm_source=yandex', referrer: 'https://yandex.ru/',
  })
  assert.equal(body.lead_tracking_id, UUID)
  assert.equal(body.metrika_client_id, '18446744073709551615')
  assert.equal(typeof body.metrika_client_id, 'string')
  assert.equal(body.yclid, '555')
  assert.equal(body.first_seen_at, '2026-10-04T18:00:00.000Z')
  assert.equal(body.pageUrl, 'https://driveset.ru/okleyka-avto?utm_source=yandex') // CRM landing_page
  assert.equal(body.referrer, 'https://yandex.ru/')
  assert.equal(body.pagePath, '/okleyka-avto') // the submit page is not overwritten by landing_page
  assert.ok(body.message.includes('YCLID: 555')) // the existing human-readable line is kept
})

test('absent identifiers are not sent at all; source stays the hard-coded Ads (deferred)', () => {
  const body = buildCrmLeadBody(input, { lead_tracking_id: UUID }) as Record<string, unknown>
  for (const key of ['metrika_client_id', 'yclid', 'first_seen_at', 'pageUrl', 'referrer']) assert.equal(key in body, false, key)
  assert.equal(body.source, 'Ads')
  assert.ok(!(body.message as string).includes('YCLID'))
})

test('service mapping is unchanged', () => {
  assert.equal(crmService({ pagePath: '/polirovka-avto', package: '' }), 'polirovka-avto')
  assert.equal(crmService({ pagePath: '/himchistka-avto', package: '' }), 'himchistka-avto')
  assert.equal(crmService({ pagePath: '/', package: 'nothing' }), 'Other')
  assert.equal(crmService({ pagePath: '/plan', package: '' }), '')
})
