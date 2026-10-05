// Browser-side flag "this page load is a verified test session". Set only from the server's status answer; nothing here
// is authoritative for the CRM (the cookie, verified server-side, is). Kept apart so marketing-events can read it
// without importing the client fetch code.

let active = false

export const isTestSessionActive = () => active
export function setTestSessionActive(value: boolean) {
  active = value
}
