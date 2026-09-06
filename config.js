// Deploy config — sets the data-feed URL for the static site.
// Primary is the same-domain proxy (functions/data/latest.json.js) so networks that
// block raw.githubusercontent.com still load; the direct GitHub URL is the automatic
// client-side fallback (boot() tries it when the proxy fails), then the localStorage
// snapshot. Absent/failed load falls back to same-origin data/latest.json (local testing).
window.SITE_DATA_URL = "/data/latest.json";
window.SITE_DATA_FALLBACK_URL = "https://raw.githubusercontent.com/ZamaAI/botexchange-data/main/latest.json";

// Venue links — swap any of these for your referral URL when you have one;
// remove an entry to render that venue as plain text. Links carry rel="sponsored".
window.VENUE_LINKS = {
  HL: "https://app.hyperliquid.xyz/join/ZAMMA",
  HYPERLIQUID: "https://app.hyperliquid.xyz/join/ZAMMA",
  GRVT: "https://grvt.io/?ref=KBZMVSI",
  EXTENDED: "https://extended.exchange/",
  LIGHTER: "https://app.lighter.xyz/?referral=ZAMA"
};

// [#355/#356] "Copy on <venue>" button on every open position at a venue listed here. {SLUG} is
// the venue's market slug: Lighter = our asset name (market symbol == asset, verified headless
// 6 Sep: /trade/ETH, /trade/BNB land on the market, the referral query rides along); Hyperliquid
// = asset for core perps and "xyz:<asset>" for HIP-3 stocks (/trade/xyz:NVDA lands on NVDA (xyz);
// a bare /trade/NVDA falls back to the default market — verified headless 6 Sep). Neither venue
// documents an order-prefill parameter, so the button opens the market and the visitor types the
// levels shown. Remove a venue's entry to drop its button.
window.COPY_TRADE_URLS = {
  LIGHTER: { url: "https://app.lighter.xyz/trade/{SLUG}?referral=ZAMA", label: "Copy on Lighter" },
  HL:      { url: "https://app.hyperliquid.xyz/trade/{SLUG}?ref=ZAMMA", label: "Copy on Hyperliquid" }
};

// Sponsor CTA target (X profile DM / contact page / mailto).
window.SPONSOR_CONTACT_URL = "https://x.com/zamma3";
