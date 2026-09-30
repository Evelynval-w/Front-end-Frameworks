import { useEffect, useState } from "react"
import MovieList from "./components/MovieList"
import SearchBar from "./components/SearchBar"
import { movieService } from "./services/movieService"
import { Movie } from "./types"

const App = ()  => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [minRating] = useState(0) // no UI for this yet, saving it for later

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await movieService.fetchMovies({ signal: controller.signal })
        setMovies(data.results)
      } catch (err) {
        // abort is intentional, don't treat it as an error
        if (err instanceof DOMException && err.name === "AbortError") return
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  // derived, not stored in state, so it can never go stale
  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()) &&
      movie.vote_average >= minRating
  )

  return (
    <div className="app-layout">
      <h1>Movie App</h1>
      <SearchBar query={query} onChange={setQuery} />
      {isLoading && <p className="status">Loading movies…</p>}
      {error && <p className="status status-error">Error: {error}</p>}
      {!isLoading && !error && <MovieList movies={filteredMovies} />}
    </div>
  )
}

export default App
