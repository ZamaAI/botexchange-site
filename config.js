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

// Sponsor CTA target (X profile DM / contact page / mailto).
window.SPONSOR_CONTACT_URL = "https://x.com/zamma3";
