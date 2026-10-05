import { SAMPLE_MOVIES } from "../data/sampleMovies";
import { getApiKey, getFavorites } from "../utils/storage";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";

// sorts a copy so we never mutate the caller's array
export function sortMovies(movies, sort = "popularity") {
  const list = [...movies];
  switch (sort) {
    case "vote_average":
    case "rating":
      return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    case "release_date":
      // newest first; empty dates sink to the bottom
      return list.sort((a, b) =>
        (b.release_date || "").localeCompare(a.release_date || "")
      );
    case "title":
      return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "popularity":
    default:
      return list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
}

function filterSample({ search, genre }) {
  let results = SAMPLE_MOVIES.slice();
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((m) => m.title.toLowerCase().includes(q));
  }
  if (genre) {
    const g = Number(genre);
    results = results.filter((m) => (m.genre_ids || []).includes(g));
  }
  return results;
}

/**
 * @param {{
 *   search?: string,
 *   genre?: string,
 *   sort?: string,
 *   onlyFavorites?: boolean,
 *   page?: number,
 *   signal?: AbortSignal,
 * }} [options]
 */
async function fetchMovies(options = {}) {
  const {
    search = "",
    genre = "",
    sort = "popularity",
    onlyFavorites = false,
    page = 1,
    signal,
  } = options;

  // favorites mode = local only, never hits the api
  if (onlyFavorites) {
    let favs = getFavorites();
    if (search) {
      const q = search.toLowerCase();
      favs = favs.filter((m) => m.title.toLowerCase().includes(q));
    }
    if (genre) {
      const g = Number(genre);
      favs = favs.filter((m) => (m.genre_ids || []).includes(g));
    }
    const sorted = sortMovies(favs, sort);
    return {
      results: sorted,
      total_pages: 1,
      total_results: sorted.length,
      isLiveApi: false,
    };
  }

  const key = getApiKey();

  // no key => offline, filter+sort sample data locally
  if (!key) {
    const results = sortMovies(filterSample({ search, genre }), sort);
    return {
      results,
      total_pages: 1,
      total_results: results.length,
      isLiveApi: false,
    };
  }

  // live api — pick the right endpoint. search wins over genre since
  // /discover doesn't accept a query string.
  let url;
  if (search) {
    url = `${BASE_URL}/search/movie?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(search)}&page=${page}`;
  } else if (genre) {
    url = `${BASE_URL}/discover/movie?api_key=${encodeURIComponent(key)}&with_genres=${encodeURIComponent(genre)}&page=${page}`;
  } else {
    url = `${BASE_URL}/movie/popular?api_key=${encodeURIComponent(key)}&page=${page}`;
  }

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`TMDB request failed: ${res.status}`);

  const data = await res.json();
  let results = data.results || [];

  // if the user filtered by genre AND searched, discover was skipped, so
  // narrow the search results by genre on the client
  if (search && genre) {
    const g = Number(genre);
    results = results.filter((m) => (m.genre_ids || []).includes(g));
  }

  results = sortMovies(results, sort);

  return {
    results,
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    isLiveApi: true,
  };
}

export const movieService = { fetchMovies };
