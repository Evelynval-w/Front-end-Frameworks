// small helpers around localStorage so components don't touch it directly
// keys match what AppContext writes, so the favorites filter sees the same data
const FAVORITES_KEY = "cinegrid_favorites";
const THEME_KEY = "cinegrid_theme";
const API_KEY = "movieapp.tmdbKey";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(movie) {
  const favs = getFavorites();
  const exists = favs.some((m) => m.id === movie.id);
  const next = exists ? favs.filter((m) => m.id !== movie.id) : [...favs, movie];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked — return the new list anyway so the UI still updates
  }
  return next;
}

export function getTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function setTheme(theme) {
  const value = theme === "light" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    // ignore, still apply on document
  }
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", value);
  }
}

export function getApiKey() {
  try {
    return localStorage.getItem(API_KEY) || "";
  } catch {
    return "";
  }
}

export function setApiKey(key) {
  const trimmed = (key || "").trim();
  try {
    localStorage.setItem(API_KEY, trimmed);
  } catch {
    // ignore
  }
}
