// [#308] /go/stats — the copy-button click counts that /go keeps (counts only; nothing personal is stored).
// { counting: false } until a KV namespace is bound to this Pages project as CLICKS.
export async function onRequestGet({ env }) {
  const json = (o) => new Response(JSON.stringify(o, null, 1), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!env || !env.CLICKS) return json({ counting: false, why: "no CLICKS KV binding on this Pages project" });
  const read = async (prefix) => {
    const out = {}; let cursor;
    do {
      const page = await env.CLICKS.list({ prefix, cursor });
      for (const k of page.keys) out[k.name.slice(prefix.length)] = parseInt((await env.CLICKS.get(k.name)) || "0", 10) || 0;
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor);
    return out;
  };
  return json({ counting: true, allTime: await read("all:"), byMarket: await read("mkt:"), byDay: await read("day:"),
    note: "approximate: KV has no atomic increment; crawlers and link previews are not counted" });
}
