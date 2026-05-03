#!/usr/bin/env node
/**
 * Fetches /sitemap.xml from a running site and checks every <loc> URL.
 *
 * Usage:
 *   npm run build && npm run start
 *   BASE_URL=http://127.0.0.1:3000 npm run check:links
 *
 * Optional:
 *   LINK_CHECK_MAX=500     — only first N sitemap URLs (plus extras)
 *   LINK_CHECK_CONCURRENCY — default 10 (high values can overload `next start`)
 *   LINK_CHECK_TIMEOUT_MS  — default 25000
 */

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const concurrency = parseInt(process.env.LINK_CHECK_CONCURRENCY ?? "10", 10);
const timeoutMs = parseInt(process.env.LINK_CHECK_TIMEOUT_MS ?? "25000", 10);
const maxUrls = process.env.LINK_CHECK_MAX
  ? parseInt(process.env.LINK_CHECK_MAX, 10)
  : Infinity;

/** Sitemap <loc> may use another origin (e.g. localhost vs 127.0.0.1). Always hit BASE_URL. */
function sameOriginUrl(loc) {
  try {
    const u = new URL(loc);
    const b = new URL(`${base}/`);
    return `${b.origin}${u.pathname}${u.search}`;
  } catch {
    return loc.startsWith("http") ? loc : `${base}${loc.startsWith("/") ? loc : `/${loc}`}`;
  }
}

async function checkUrl(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      redirect: "follow",
      signal: controller.signal,
    });
    return res.status;
  } finally {
    clearTimeout(t);
  }
}

async function checkOne(url) {
  try {
    const status = await checkUrl(url);
    const ok =
      (status >= 200 && status < 400) ||
      status === 416 /** some servers reject Range */;
    return { url, status, ok };
  } catch (e) {
    return {
      url,
      status: 0,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function pool(urls, limit, fn) {
  const cursor = { i: 0 };
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const j = cursor.i++;
      if (j >= urls.length) return;
      await fn(urls[j], j);
    }
  });
  await Promise.all(workers);
}

async function main() {
  const extraPaths = ["/ads.txt", "/robots.txt"];

  let pingRes;
  try {
    pingRes = await fetch(`${base}/en`, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      signal: AbortSignal.timeout(Math.min(5000, timeoutMs)),
    });
  } catch {
    console.error(
      `Cannot reach ${base}/en — start the app first:\n  npm run build && npm run start\n`,
    );
    process.exit(1);
  }

  if (!pingRes.ok || pingRes.status >= 500) {
    console.error(
      `Cannot reach ${base}/en (HTTP ${pingRes.status}) — start the app first:\n  npm run build && npm run start\n`,
    );
    process.exit(1);
  }

  const smRes = await fetch(`${base}/sitemap.xml`, {
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!smRes.ok) {
    console.error(`Failed to fetch sitemap: HTTP ${smRes.status}`);
    process.exit(1);
  }
  const xml = await smRes.text();
  let locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    sameOriginUrl(m[1].trim()),
  );
  if (Number.isFinite(maxUrls)) {
    locs = locs.slice(0, maxUrls);
  }

  const extraUrls = extraPaths.map((p) => `${base}${p}`);
  const urls = [...new Set([...locs, ...extraUrls])];

  console.log(`Base: ${base}`);
  console.log(`URLs to check: ${urls.length}${Number.isFinite(maxUrls) ? ` (capped by LINK_CHECK_MAX)` : ""}\n`);

  const failures = [];
  let done = 0;

  await pool(urls, concurrency, async (url) => {
    const r = await checkOne(url);
    done += 1;
    if (done % 250 === 0 || done === urls.length) {
      process.stdout.write(`\rProgress: ${done}/${urls.length}`);
    }
    if (!r.ok) failures.push(r);
  });

  process.stdout.write("\n\n");

  if (failures.length === 0) {
    console.log("All checks passed (2xx/3xx, or 416 with Range).");
    process.exit(0);
  }

  console.error(`Failed: ${failures.length} URL(s)\n`);
  for (const f of failures.slice(0, 80)) {
    if ("error" in f && f.error) {
      console.error(`${f.status}\t${f.error}\t${f.url}`);
    } else {
      console.error(`${f.status}\t${f.url}`);
    }
  }
  if (failures.length > 80) {
    console.error(`… and ${failures.length - 80} more`);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
