// lead_tracking_id: one random UUID per lead attempt. The same id is reused by retries of that attempt (the CRM
// treats a repeated id as the same lead) and released only after a confirmed 201, so the next new lead gets a new one.
// Without crypto.randomUUID the field is simply not sent — the lead never depends on it.
// NOT a Metrika visit id and not proof that a Metrika visit has been linked to the lead.

let current: string | null = null

export function getLeadTrackingId(): string | null {
  if (current) return current
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') current = crypto.randomUUID()
  } catch {
    current = null
  }
  return current
}

export function releaseLeadTrackingId(): void {
  current = null
}
