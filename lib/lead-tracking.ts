// lead_tracking_id: one random UUID per lead attempt. The same id is reused by retries of that attempt (the CRM
// treats a repeated id as the same lead) and released only after a confirmed 201, so the next new lead gets a new one.
// Without crypto.randomUUID the field is simply not sent — the lead never depends on it.
// NOT a Metrika visit id and not proof that a Metrika visit has been linked to the lead.

// Pending ids are bound to a stable key of the BUSINESS lead (draft fields + submit pagePath; never analytics metadata):
// the same lead retried keeps its id whatever else was submitted in between, an edited lead or another page gets a new
// one, so the CRM can never read a different lead as a replay of a lost one. A confirmed 201 drops only that lead's id.
// Page memory only (no storage, no timers); entries exist just for attempts that have not been confirmed.

const pending = new Map<string, string>()

/** Order-independent key of the business draft plus the page it is submitted from. */
export function leadDraftKey(draft: object, pagePath: string): string {
  const record = draft as Record<string, unknown>
  return JSON.stringify([pagePath, Object.keys(record).sort().map((k) => [k, record[k]])])
}

export function getLeadTrackingId(key: string): string | null {
  const existing = pending.get(key)
  if (existing) return existing
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      const id = crypto.randomUUID()
      pending.set(key, id)
      return id
    }
  } catch {
    // no id: the lead goes out without one
  }
  return null
}

export function releaseLeadTrackingId(key: string): void {
  pending.delete(key)
}

/** For tests only. */
export function resetLeadTracking(): void {
  pending.clear()
}
