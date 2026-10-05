#!/bin/sh
# Read-only production diagnostic for /api/lead: prints names, paths and yes/no only — never a value.
# Usage: sh scripts/check-lead-env.sh [service]   (exit 1 when lead delivery cannot work, 0 otherwise)
SERVICE="${1:-driveset.service}"
show() { systemctl show "$SERVICE" -p "$1" --value; }
PID="$(show MainPID)"
echo "service=$SERVICE active=$(show ActiveState) user=$(show User) pid=$PID workdir=$(show WorkingDirectory)"

FILES="$(show EnvironmentFiles | awk 'NF{print $1}')"
echo "EnvironmentFiles: ${FILES:-none}"
for f in $FILES; do
  if [ -r "$f" ]; then
    for NAME in OLNOO_CRM_URL OLNOO_CRM_API_KEY; do
      if grep -q "^$NAME=." "$f"; then echo "file $f: $NAME SET"
      elif grep -q "^$NAME=\$" "$f"; then echo "file $f: $NAME EMPTY"
      else echo "file $f: $NAME MISSING"; fi
    done
  else
    echo "file $f: UNREADABLE or not found"
  fi
done

STATUS=0
if [ -r "/proc/$PID/environ" ] && [ "$PID" != "0" ]; then
  for NAME in OLNOO_CRM_URL OLNOO_CRM_API_KEY; do
    if tr '\0' '\n' < "/proc/$PID/environ" | grep -q "^$NAME=."; then echo "process $NAME: SET"
    else echo "process $NAME: MISSING"; STATUS=1; fi
  done
  URL="$(tr '\0' '\n' < "/proc/$PID/environ" | grep '^OLNOO_CRM_URL=' | head -n 1 | cut -d= -f2-)"
  if [ -n "$URL" ]; then
    # Same acceptance rules as crmEndpoint() in app/api/lead/route.ts (NODE_ENV=production); booleans only.
    OLNOO_CRM_URL="$URL" node -e '
      const raw = process.env.OLNOO_CRM_URL
      const yn = (x) => (x ? "yes" : "no")
      let u = null
      try { u = new URL(raw) } catch {}
      console.log("url parses: " + yn(u))
      console.log("url has whitespace/quote chars: " + yn(/["\x27\s]/.test(raw)))
      if (u) {
        console.log("url protocol https: " + yn(u.protocol === "https:"))
        console.log("url without userinfo: " + yn(!u.username && !u.password))
        console.log("url without query: " + yn(!u.search))
        console.log("url without hash: " + yn(!u.hash))
      }
      const ok = !!u && u.protocol === "https:" && !u.username && !u.password && !u.search && !u.hash
      console.log("url accepted by /api/lead: " + yn(ok))
      process.exit(ok ? 0 : 1)
    ' || STATUS=1
    URL=
  fi
else
  echo "process environment: UNKNOWN (not readable or service not running)"
fi
exit "$STATUS"
