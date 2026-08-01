// Live og:image — proxies the daily card crop the bot pushes to the data repo, so every
// shared link previews TODAY's scoreboard instead of a frozen logo. Same pattern as
// data/latest.json.js. The static og-card.png was removed so this route reaches the
// function (Pages serves matching static assets before functions). 5-min edge cache; on
// any upstream problem we redirect to the data-repo URL directly rather than 404 a
// scraper. Delete this file + restore a static og-card.png to revert.
const UPSTREAM = "https://raw.githubusercontent.com/ZamaAI/botexchange-data/main/og-card.png";

export async function onRequestGet() {
  try {
    const up = await fetch(UPSTREAM, { cf: { cacheTtl: 300, cacheEverything: true } });
    if (!up.ok) return Response.redirect(UPSTREAM, 302);
    return new Response(up.body, {
      headers: { "content-type": "image/png", "cache-control": "public, max-age=300" }
    });
  } catch (e) {
    return Response.redirect(UPSTREAM, 302);
  }
}
