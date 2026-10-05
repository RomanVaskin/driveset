# OLNOO_PRODUCTION.md — DriveSet production runbook

Короткий runbook. Подробности по коду — `OLNOO_PROJECT_MAP.md`, решения — `OLNOO_ARCHITECTURE.md`.
Значения секретов здесь не хранятся.

## Production topology

| Что | Значение |
| --- | --- |
| Провайдер | Beget VPS (Ubuntu) |
| IP | `31.207.74.26` |
| Домен | `driveset.ru` |
| Приложение | `/opt/driveset` (Next.js, pnpm) |
| systemd | `driveset.service` |
| Порт | `3230` на `127.0.0.1` |
| nginx | `driveset.ru` → upstream `127.0.0.1:3230`; `/media/` раздаётся из `/opt/media/driveset` |
| Media (вне Git) | `/opt/media/driveset` (`hero-optimized.mp4`, `portfolio/`, `portfolio-web/`) |
| SSL | Certbot / Let's Encrypt |
| Заявки | `/api/lead` → OLNOO CRM (`OLNOO_CRM_URL`, `OLNOO_CRM_API_KEY` — server-only env) |

KZ-сервер `213.155.29.140` (hostname `vdska`, `/opt/olnoo/projects/driveset`) — **тоже не production**: последний деплой на него — Deploy DriveSet #27 (`a1a9b1b`, 2026-10-03), после переключения `SERVER_HOST` деплой туда не идёт. Его `driveset.service` и `/opt/olnoo/secrets/driveset.env` не отражают состояние production: не использовать для проверок `HEAD`, env и заявок.

REG.RU `194.67.113.146` — **не production и не готовый rollback**, а временная legacy-копия: после переключения деплой её не обновляет.

## Deploy flow

Push в `main` → GitHub Actions (`.github/workflows/deploy.yml`) → SSH на Beget →
`git fetch` + `git reset --hard origin/main` → `corepack enable` → `pnpm install --frozen-lockfile` →
`pnpm build` → `systemctl restart driveset.service` → `systemctl is-active` → `curl http://127.0.0.1:3230`.

Перед рестартом и после него `deploy.yml` fail-fast проверяет: `origin` — `RomanVaskin/driveset`; деплоенный `HEAD` содержит SHA запуска; `WorkingDirectory` у `driveset.service` совпадает с `/opt/driveset`; сервис отвечает на `:3230`; `OLNOO_CRM_URL` и `OLNOO_CRM_API_KEY` заданы в процессе сервиса (только SET/MISSING, значения не печатаются; `UNKNOWN`, если окружение процесса нечитаемо). В логе — строка `deployed <sha> from <dir> on <hostname>`.

GitHub Secrets: `SERVER_HOST` (→ `31.207.74.26`), `SERVER_USER`, `SERVER_SSH_KEY`.
Media и production env в Git не входят и деплоем не меняются.

## Smoke checks

На сервере:

```bash
systemctl is-active driveset.service
curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3230
nginx -t
journalctl -u driveset.service -n 50 --no-pager
```

Снаружи (все ожидаемо `200`):

```bash
for p in / /okleyka-avto /polirovka-avto /himchistka-avto /sitemap.xml /media/hero-optimized.mp4; do
  curl -sS -o /dev/null -w "$p %{http_code}\n" "https://driveset.ru$p"
done
curl -sSI https://driveset.ru | head -1
echo | openssl s_client -connect driveset.ru:443 -servername driveset.ru 2>/dev/null | openssl x509 -noout -enddate
```

Медиа-pipeline (при добавлении portfolio-файлов):
`pnpm --dir /opt/driveset run media:portfolio` (пути по умолчанию уже `/opt/media/driveset/…`).

## Rollback

Откат кода (на Beget): `git -C /opt/driveset reset --hard <good-sha>` → `pnpm install --frozen-lockfile` →
`pnpm build` → `systemctl restart driveset.service` → smoke checks. Либо revert-коммит в `main` и обычный deploy.

Откат на прежний сервер REG.RU (`194.67.113.146`, только при недоступности Beget):
1. REG.RU — legacy-копия, **не обновляется** деплоем. Перед возможным откатом синхронизировать актуальный `main`
   (`/opt/driveset`, `pnpm install --frozen-lockfile`, `pnpm build`, `systemctl restart driveset.service`) и проверить
   env (в т.ч. `OLNOO_CRM_*`), media и service.
2. Вернуть DNS `driveset.ru` на `194.67.113.146` и `SERVER_HOST` на его значение.
3. Прогнать smoke checks. Когда legacy-копия не нужна, убрать REG.RU из документации.

Заявки хранятся в OLNOO CRM, а не на сервере сайта — при откате они не теряются.
