import { useEffect, useState } from "react";
import {
  getWebsiteLocale,
  setWebsiteLocale,
  startWebsiteLocalization,
  websiteLocales,
  type WebsiteLocale,
} from "../../../../packages/i18n/website";

export function WebsiteLocalizationRuntime() {
  useEffect(() => startWebsiteLocalization(), []);
  return null;
}

export function WebsiteLanguageSelect() {
  const [locale, setLocale] = useState<WebsiteLocale>(() => getWebsiteLocale());
  useEffect(() => {
    const update = (event: Event) => setLocale((event as CustomEvent<WebsiteLocale>).detail);
    document.addEventListener("ayusetu:locale-change", update);
    return () => document.removeEventListener("ayusetu:locale-change", update);
  }, []);

  return (
    <label className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur">
      <span className="sr-only">Language</span>
      <select
        data-website-locale
        aria-label="Choose language"
        value={locale}
        onChange={(event) => {
          const selected = event.target.value as WebsiteLocale;
          setLocale(selected);
          setWebsiteLocale(selected);
        }}
      >
        {Object.entries(websiteLocales).map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </label>
  );
}
