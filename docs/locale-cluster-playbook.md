# Locale Cluster Playbook

## Objective
Roll out locale-native keyword expansion in waves without changing core tool behavior.

## Priority Order
1. English (`en`)
2. Spanish (`es`)
3. Hindi (`hi`)
4. German (`de`)
5. French (`fr`)
6. Portuguese (`pt`)
7. Japanese (`ja`)
8. Arabic (`ar`)

## Per-Locale Rollout Steps
1. Select one intent cluster (for example: study timers).
2. Confirm localized slug patterns and title wording.
3. Apply locale-native keyword suffixes in metadata (feature flagged).
4. Verify sitemap + hreflang alternates still map canonical URLs correctly.
5. Check CTR/indexing changes after 7-14 days before scaling.

## Cluster Template
- Pattern: `[intent]-timer` and `[duration]-minute-timer`
- On-page sections: intro, steps, use cases, precision notes, FAQ
- Internal links: hub -> intent pages -> related tools
- Schema: FAQPage + BreadcrumbList + SoftwareApplication

## Safety
- Keep `NEXT_PUBLIC_FLAG_LOCALE_KEYWORDS` disabled by default.
- Enable one locale at a time and monitor Search Console performance.
- Roll back instantly by setting the flag OFF.
