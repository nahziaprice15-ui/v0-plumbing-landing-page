# Sentry setup (quick)

This project follows [issue #6](https://github.com/nahziaprice15-ui/v0-plumbing-landing-page/issues/6) for full scope. Use this checklist when creating the account and wiring the app.

## 1. Account & project

1. Sign up at [sentry.io](https://sentry.io) (or join an existing org).
2. Create a **Project** → platform **Next.js** (or JavaScript → Next.js).
3. Note the **DSN** from *Project Settings → Client Keys (DSN)*.

## 2. Environment variables

Set in your host (e.g. Vercel) — **do not commit secrets**.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client + server reporting (public DSN is expected in the browser). |
| `SENTRY_AUTH_TOKEN` | CI/build: upload source maps (create under *Settings → Auth Tokens*, scope: `project:releases`). |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Often required by the Sentry webpack plugin for releases and maps. |

Use **separate projects or environments** for production vs preview if you want clean separation.

## 3. SDK (Next.js)

- Official path: [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/).
- This repo already includes `@sentry/nextjs`, `instrumentation-client.ts`, server/edge configs, `instrumentation.ts`, and `withSentryConfig` in `next.config.mjs`.

### Verify connection

1. Set `NEXT_PUBLIC_SENTRY_DSN` in `.env` (local) or Vercel env, restart `npm run dev`.
2. In **development**, open `/sentry-example-page` and use **Send test event**. You should see a toast and a new issue in Sentry → **Issues** (title contains `[Sentry verify]`).
3. Optional: open **Issues → Open** and confirm environment (`development` / `production`) matches where you triggered the test.

## 4. Source maps

- Keep `SENTRY_AUTH_TOKEN` only in CI/host secrets.
- Ensure release names match between build and Sentry (wizard usually sets this up).

## 5. User feedback

- [User Feedback (widget)](https://docs.sentry.io/platforms/javascript/user-feedback/) — add where product wants it (e.g. layout or error UI).
- Feedback submissions should show as linked context on issues in Sentry.

## 6. Alerts

In Sentry: **Alerts** → create a rule (e.g. notify on first occurrence of an issue, or error-rate spike) so production issues are not missed.

## 7. Done when

- DSN configured in production (and preview if desired).
- Errors appear in Sentry with readable stacks.
- Feedback works end-to-end.
- At least one alert is active.

---

*Update this file if env names or hosting steps change.*
