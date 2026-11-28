// [#308] /go?v=<VENUE>&m=<MARKET> — every "Copy on <venue>" button goes through here. It sends the visitor on to the venue
// (our referral link where the venue has one) and counts the click, so the site can learn whether anyone copies at all
// (28 Nov 2026: the Hyperliquid referral code had brought 0 users since the buttons went up in September).
//
// - The redirect targets are THIS allowlist, never a URL from the request — no open redirect. Keep it in step with
//   COPY_TRADE_URLS in config.js (that file decides which buttons are drawn and their labels).
// - The market slug is checked (letters, digits, an optional "xyz:" for Hyperliquid stocks); a bad one goes to the venue's home.
// - Counting needs a KV namespace bound to this Pages project as CLICKS (Cloudflare dashboard → the project → Settings →
//   Functions → KV namespace bindings). Without it the redirect still works and the log says the click was NOT counted.
// - Only counts are stored: per venue per day, per venue all-time, per venue+market all-time. No IP, no cookie, nothing personal.
//   KV has no atomic increment, so two clicks in the same instant can count as one: a demand signal, not an audit figure.
// - Link-preview and crawler user agents are redirected but not counted.
const VENUES = {
  LIGHTER:    { market: "https://app.lighter.xyz/trade/{SLUG}?referral=ZAMA", home: "https://app.lighter.xyz/?referral=ZAMA" },
  HL:         { market: "https://app.hyperliquid.xyz/trade/{SLUG}?ref=ZAMMA", home: "https://app.hyperliquid.xyz/join/ZAMMA" },
  PAPERTRADE: { market: null, home: "https://papertrade.xyz/" }   // no per-market URL (/trade/ETH is a 404, read 28 Nov)
};
const SLUG_RE = /^(xyz:)?[A-Za-z0-9]{1,15}$/;
const BOT_RE = /bot|crawl|spider|preview|slurp|facebookexternalhit|embed|curl|wget|python|headless/i;

export function target(v, m) {
  const ven = VENUES[String(v || "").toUpperCase()];
  if (!ven) return { url: "https://thebotexchange.com/", venue: null, slug: null };
  const slug = SLUG_RE.test(String(m || "")) ? String(m) : null;
  if (ven.market && slug) return { url: ven.market.replace("{SLUG}", encodeURIComponent(slug).replace("%3A", ":")), venue: String(v).toUpperCase(), slug: slug.toUpperCase() };
  return { url: ven.home, venue: String(v).toUpperCase(), slug };
}

async function bump(kv, key) {
  const n = parseInt((await kv.get(key)) || "0", 10) || 0;
  await kv.put(key, String(n + 1));
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const q = new URL(request.url).searchParams;
  const t = target(q.get("v"), q.get("m"));
  const ua = request.headers.get("user-agent") || "";
  if (t.venue && !BOT_RE.test(ua)) {
    if (env && env.CLICKS) {
      const day = new Date().toISOString().slice(0, 10);
      context.waitUntil(Promise.all([
        bump(env.CLICKS, `day:${day}:${t.venue}`),
        bump(env.CLICKS, `all:${t.venue}`),
        t.slug ? bump(env.CLICKS, `mkt:${t.venue}:${t.slug.toUpperCase()}`) : null
      ].filter(Boolean)).catch(e => console.log(`[#308 go] count FAILED for ${t.venue}: ${e && e.message}`)));
    } else {
      console.log(`[#308 go] ${t.venue} click NOT counted — no CLICKS KV binding on this project`);
    }
  }
  return new Response(null, { status: 302, headers: { Location: t.url, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer-when-downgrade" } });
}
