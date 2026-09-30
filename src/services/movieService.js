import { SAMPLE_MOVIES } from "../data/sampleMovies";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";

function filterSample(search) {
  if (!search) return SAMPLE_MOVIES;
  const q = search.toLowerCase();
  return SAMPLE_MOVIES.filter((m) => m.title.toLowerCase().includes(q));
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
    // genre, sort, onlyFavorites are accepted but not wired up until session 4
    page = 1,
    signal,
  } = options;
  const key = import.meta.env.VITE_TMDB_API_KEY;

  // no key => stay offline, filter the local sample data by title
  if (!key || key === "your_api_key_here") {
    const results = filterSample(search);
    return {
      results,
      total_pages: 1,
      total_results: results.length,
      isLiveApi: false,
    };
  }

  const endpoint = search
    ? `${BASE_URL}/search/movie?query=${encodeURIComponent(search)}&page=${page}`
    : `${BASE_URL}/movie/popular?page=${page}`;

  const res = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    isLiveApi: true,
  };
}

export const movieService = { fetchMovies };
