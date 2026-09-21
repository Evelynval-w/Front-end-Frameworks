import { useState } from "react"
import MovieList from "./components/MovieList"
import SearchBar from "./components/SearchBar"
import { SAMPLE_MOVIES } from "./data/sampleMovies"
import { Movie } from "./types"

const App = ()  => {
  const [movies] = useState<Movie[]>(SAMPLE_MOVIES)
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
      <MovieList movies={filteredMovies} />
    </div>
  )
}

export default App
