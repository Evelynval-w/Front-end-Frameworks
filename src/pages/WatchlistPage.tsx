import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import MovieCard from "../components/MovieCard"
import MovieModal from "../components/MovieModal"
import { useAppContext } from "../context/AppContext"
import type { Movie } from "../types"

export default function WatchlistPage() {
  // the whole page is just a consumer of the global favorites array,
  // no local list state, no re-fetch, no prop drilling
  const { favorites } = useAppContext()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  return (
    <div className="app-layout">
      <Header />

      <section className="watchlist-section">
        <div className="watchlist-header">
          <h2>My Watchlist</h2>
          <p className="watchlist-count">
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <p>You haven&apos;t saved any movies yet.</p>
            <Link to="/" className="btn-primary">
              Browse movies
            </Link>
          </div>
        ) : (
          <div className="movies-grid">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}
