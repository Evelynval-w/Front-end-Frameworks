import { useState } from "react"
import MovieList from "./components/MovieList"
import SearchBar from "./components/SearchBar"
import { useMovies } from "./hooks/useMovies"

const App = ()  => {
  const { movies, isLoading, error } = useMovies()
  const [query, setQuery] = useState("")
  const [minRating] = useState(0) // no UI for this yet, saving it for later

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
