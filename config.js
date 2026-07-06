// Deploy config — sets the data-feed URL for the static site.
// Absent/failed load falls back to same-origin data/latest.json (local testing).
window.SITE_DATA_URL = "https://raw.githubusercontent.com/ZamaAI/botexchange-data/main/latest.json";

// Venue links — swap any of these for your referral URL when you have one;
// remove an entry to render that venue as plain text. Links carry rel="sponsored".
window.VENUE_LINKS = {
  HL: "https://app.hyperliquid.xyz/trade",
  GRVT: "https://grvt.io/",
  EXTENDED: "https://extended.exchange/"
};

// Sponsor CTA target (X profile DM / contact page / mailto).
window.SPONSOR_CONTACT_URL = "https://x.com/ZamaSentinel";
