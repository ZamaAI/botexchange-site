// Same-domain feed proxy — serves the public feed at thebotexchange.com/data/latest.json
// so human visitors on networks that block raw.githubusercontent.com (strict corporate
// proxies, China) still load the live board. This Cloudflare Pages Function runs ONLY
// for this one route; every other path on the site remains a straight static serve.
// 60s edge cache keeps upstream fetches to ~1/min per region (feed updates every 5 min).
// Failure mode: any upstream problem returns 502 and the page's client-side chain falls
// back to the direct GitHub URL, then the localStorage snapshot — behavior identical to
// the site before this file existed. Delete this file to remove the proxy entirely.
const UPSTREAM = "https://raw.githubusercontent.com/ZamaAI/botexchange-data/main/latest.json";

export async function onRequestGet() {
  try {
    const up = await fetch(UPSTREAM, { cf: { cacheTtl: 60, cacheEverything: true } });
    if (!up.ok) return new Response('{"error":"upstream ' + up.status + '"}', {
      status: 502, headers: { "content-type": "application/json" }
    });
    return new Response(up.body, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=60"
      }
    });
  } catch (e) {
    return new Response('{"error":"proxy fetch failed"}', {
      status: 502, headers: { "content-type": "application/json" }
    });
  }
}
