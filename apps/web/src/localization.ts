import {
  getWebsiteLocale,
  startWebsiteLocalization,
} from "../../../packages/i18n/website";

const stopLocalization = startWebsiteLocalization();
const app = document.querySelector("#app");
if (app && !document.querySelector("[data-website-locale]")) {
  document.body.insertAdjacentHTML(
    "beforeend",
    '<label style="position:fixed;right:16px;bottom:16px;z-index:100;display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid #d8e2dc;border-radius:12px;background:#ffffffed;color:#25372f;font:600 12px system-ui;box-shadow:0 6px 24px #203b2e20;backdrop-filter:blur(8px)"><span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">Language</span><select data-website-locale aria-label="Choose language" style="border:0;background:transparent;color:inherit;font:inherit"><option value="en-IN">English</option><option value="hi-IN">हिन्दी</option><option value="pa-IN">ਪੰਜਾਬੀ</option><option value="ta-IN">தமிழ்</option></select></label>',
  );
  const selector = document.querySelector(
    "[data-website-locale]",
  ) as unknown as HTMLSelectElement | null;
  if (selector) selector.value = getWebsiteLocale();
}

if (import.meta.hot) import.meta.hot.dispose(stopLocalization);
