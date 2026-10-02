export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function formatTime(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Clears all user account & session data from Chrome storage (localStorage, sessionStorage, cookies)
 * Preserves user global preferences like language and theme for convenience.
 */
export function clearChromeAccountStorage() {
  if (typeof window === "undefined") return;

  try {
    // 1. Clear localStorage account data
    localStorage.removeItem("webrev_data");
    localStorage.removeItem("webrev_user");
    localStorage.removeItem("webrev_account");
    localStorage.removeItem("webrev_session");

    // Clear any extra WebRev storage keys, excluding theme and language
    const preservedKeys = new Set(["webrev_lang", "webrev_theme"]);
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("webrev_") && !preservedKeys.has(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // 2. Clear sessionStorage completely
    sessionStorage.clear();

    // 3. Clear any cookies that might have been set
    if (document.cookie) {
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    }

    console.info("[WebRev] Chrome account storage successfully cleared.");
    return true;
  } catch (err) {
    console.error("[WebRev] Failed to clear Chrome account storage:", err);
    return false;
  }
}
