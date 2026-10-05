// lead_tracking_id: one random UUID per lead attempt. The same id is reused by retries of that attempt (the CRM
// treats a repeated id as the same lead) and released only after a confirmed 201, so the next new lead gets a new one.
// Without crypto.randomUUID the field is simply not sent — the lead never depends on it.
// NOT a Metrika visit id and not proof that a Metrika visit has been linked to the lead.

// The id is bound to a stable key of the BUSINESS fields of the lead (never analytics metadata): the same lead retried
// keeps its id, an edited lead gets a new one, so the CRM can never read a different lead as a replay of a lost one.
// One slot: starting another lead replaces it; a finished lead clears the slot only if it still holds that lead's id.

let current: { key: string; id: string } | null = null

/** Order-independent key of the business draft. */
export function leadDraftKey(draft: object): string {
  const record = draft as Record<string, unknown>
  return JSON.stringify(Object.keys(record).sort().map((k) => [k, record[k]]))
}

export function getLeadTrackingId(key: string): string | null {
  if (current && current.key === key) return current.id
  current = null
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') current = { key, id: crypto.randomUUID() }
  } catch {
    current = null
  }
  return current ? current.id : null
}

export function releaseLeadTrackingId(key: string): void {
  if (current && current.key === key) current = null
}

/** For tests only. */
export function resetLeadTracking(): void {
  current = null
}
