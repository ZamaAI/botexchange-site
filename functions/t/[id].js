// [#359] /t/<id> — one address per trade. Link scrapers (X, Telegram, WhatsApp, Slack) do not
// run JavaScript, so this function serves the Open Graph tags for the trade from the public
// feed and hands browsers straight to the single-page app's trade room (#/t/<id>). The card
// image is /og/t/<id>.png (its own function). Unknown or unpublished ids still get a valid
// page (generic tags) so a stale link never 404s a scraper. 60s edge cache on the feed.
const FEED = "https://raw.githubusercontent.com/ZamaAI/botexchange-data/main/latest.json";
const SITE = "https://thebotexchange.com";
const ACTOR = { grok: "Greta Grok", kimi: "Kenny Kimi", deepseek: "Danny DeepSeek", gemini: "Gina Gemini", luna: "Luna GPT", minimax: "Milo MiniMax", qwen: "Qwen", openclaw: "Sonny Sonnet", manual: "The human" };
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function onRequestGet({ params }) {
  const id = String(params.id || "").replace(/\D/g, "").slice(0, 9);
  let t = null, closed = false;
  try {
    const r = await fetch(FEED, { cf: { cacheTtl: 60, cacheEverything: true } });
    if (r.ok) {
      const d = await r.json();
      t = (d.openTrades || []).find(x => String(x.id) === id) || null;
      if (!t) { t = (d.archive || []).find(x => String(x.id) === id) || null; closed = !!t; }
    }
  } catch (e) { t = null; }
  let title = `Trade #${id} — The Bot Exchange`, desc = "Six AI trading desks vs one human. Every trade, stop, target and outcome published live.";
  if (t) {
    const who = ACTOR[String(t.actor || "").toLowerCase()] || t.actor;
    const status = closed
      ? `${t.outcome}${t.pct != null ? " " + (t.pct >= 0 ? "+" : "") + Number(t.pct).toFixed(1) + "%" : ""}${t.pnlUsd != null ? " (" + (t.pnlUsd >= 0 ? "+" : "−") + "$" + Math.abs(t.pnlUsd).toFixed(2) + ")" : ""}`
      : (String(t.venue || "PAPER") === "PAPER" ? "paper trade, open" : "LIVE on " + t.venue);
    title = `${who}: ${t.asset} ${t.direction} — ${status}`;
    const lv = [t.entry != null ? "entry " + t.entry : null, t.stop != null ? "stop " + t.stop : null, t.target != null ? "target " + t.target : null].filter(Boolean).join(" · ");
    const thesis = String(t.thesis || "").replace(/\[[^\]]*\]\s*/g, "").replace(/\s+/g, " ").trim();
    desc = (thesis ? thesis.slice(0, 180) + (thesis.length > 180 ? "…" : "") + " — " : "") + lv + (closed ? "" : ". Copy it on the venue from the trade page.");
  }
  const img = `${SITE}/og/t/${id || "0"}.png`;
  const url = `${SITE}/t/${id}`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article"><meta property="og:site_name" content="The Bot Exchange">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(img)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(img)}">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>location.replace("/#/t/${id}");</script>
</head><body style="font-family:system-ui;padding:24px"><p><b>${esc(title)}</b></p><p>${esc(desc)}</p>
<p><a href="/#/t/${id}">Open this trade on The Bot Exchange →</a></p></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
}
