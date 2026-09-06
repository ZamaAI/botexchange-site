// [#359] /og/t/<id>.png — the share card for one trade. Proxies cards/t<id>.png that the bot
// pushes to the data repo (setup card while open, result card once closed); if the card is not
// there yet (a trade opened in the last few minutes, or an id outside the published window) it
// serves the daily scoreboard card instead, so a scraper always gets a real image. 5-min edge
// cache: a closed trade's result card replaces its setup card within that window.
const REPO = "https://raw.githubusercontent.com/ZamaAI/botexchange-data/main";

export async function onRequestGet({ params }) {
  const id = String(params.id || "").replace(/\D/g, "").slice(0, 9);
  const urls = [`${REPO}/cards/t${id}.png`, `${REPO}/og-card.png`];
  for (const u of urls) {
    try {
      const up = await fetch(u, { cf: { cacheTtl: 300, cacheEverything: true } });
      if (up.ok) return new Response(up.body, { headers: { "content-type": "image/png", "cache-control": "public, max-age=300" } });
    } catch (e) { /* try the next */ }
  }
  return Response.redirect(`${REPO}/og-card.png`, 302);
}
