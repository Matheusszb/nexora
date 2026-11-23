"use client";

export function CookiePreferencesButton() {
  return <button type="button" className="cookie-preferences-button" onClick={() => window.dispatchEvent(new Event("nexora:cookie-preferences"))}>Preferências de cookies</button>;
}
