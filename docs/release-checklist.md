# Utility Clock Release Checklist

## Build Safety
- `npm run lint`
- `npm run build`
- Verify no new lint/type/runtime errors.

## Core Smoke Tests
- Home page loads for at least one locale (`/en`).
- Timer hub and timer slug page render (`/en/timer`, `/en/timer/10-minute-timer`).
- Alarm/Stopwatch/World Clock hubs render.
- Timer controls work: start, pause, resume, reset, fullscreen, share panel.
- Alarm sound and notification prompt behavior still works.

## Responsive Sanity
- Mobile width check: no clipped timer controls.
- Tablet/desktop width check: layout remains balanced and readable.

## SEO/Linking
- `sitemap.xml` loads and includes expected canonical routes.
- No broken internal links in changed areas (`npm run check:links` when needed).
- Metadata and JSON-LD still render for tool pages.

## Rollout Procedure
- Keep new feature flags OFF by default.
- Enable one flag at a time.
- Monitor errors and engagement after each enablement.
- Roll back by disabling the specific flag if regressions appear.
