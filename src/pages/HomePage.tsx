import { useEffect, useState } from "react"
import Header from "../components/Header"
import FilterBar from "../components/FilterBar"
import StatsBanner from "../components/StatsBanner"
import MovieCard from "../components/MovieCard"
import MovieModal from "../components/MovieModal"
import ApiConfigModal from "../components/ApiConfigModal"
import { movieService } from "../services/movieService"
import { getFavorites, getTheme, setTheme as persistTheme } from "../utils/storage"
import { Movie } from "../types"

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLiveApi, setIsLiveApi] = useState(false)

  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [sort, setSort] = useState("popularity")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [apiConfigOpen, setApiConfigOpen] = useState(false)

  const [theme, setTheme] = useState<"dark" | "light">(getTheme())
  const [favCount, setFavCount] = useState(getFavorites().length)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await movieService.fetchMovies({
          search,
          genre,
          sort,
          onlyFavorites,
          signal: controller.signal,
        })
        setMovies(data.results)
        setIsLiveApi(data.isLiveApi)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [search, genre, sort, onlyFavorites])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    persistTheme(next)
  }

  const refreshFavCount = () => setFavCount(getFavorites().length)

  const avgRating =
    movies.length > 0
      ? movies.reduce((s, m) => s + (m.vote_average || 0), 0) / movies.length
      : 0

  return (
    <div className="app-layout">
      <Header
        search={search}
        onSearch={setSearch}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites((v) => !v)}
        theme={theme}
        onToggleTheme={toggleTheme}
        favCount={favCount}
        onOpenApiConfig={() => setApiConfigOpen(true)}
      />
      <FilterBar
        genre={genre}
        onGenreChange={setGenre}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />
      <StatsBanner
        count={movies.length}
        avgRating={avgRating}
        activeGenre={genre}
        isLiveApi={isLiveApi}
      />
      {isLoading && <p className="status">Loading movies…</p>}
      {error && <p className="status status-error">Error: {error}</p>}
      {!isLoading && !error && (
        <div className={view === "grid" ? "movies-grid" : "movies-list"}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onFavoriteChange={refreshFavCount}
        />
      )}
      {apiConfigOpen && (
        <ApiConfigModal onClose={() => setApiConfigOpen(false)} />
      )}
    </div>
  )
}
