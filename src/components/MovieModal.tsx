import { useEffect, useState } from "react"
import { Heart, X, Youtube } from "lucide-react"
import { Movie } from "../types"
import { getBackdropUrl, getPosterUrl } from "../data/sampleMovies"
import { getGenreNames } from "../data/genres"
import { getFavorites, toggleFavorite } from "../utils/storage"

type MovieModalProps = {
  movie: Movie
  onClose: () => void
  onFavoriteChange?: () => void
}

export default function MovieModal({
  movie,
  onClose,
  onFavoriteChange,
}: MovieModalProps) {
  const [isFavorite, setIsFavorite] = useState(
    getFavorites().some((m: Movie) => m.id === movie.id)
  )

  // lock scroll + listen for Escape; always clean up both so a stuck
  // body-overflow or dangling listener can't bleed into the next modal
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleToggleFavorite = () => {
    const next = toggleFavorite(movie)
    setIsFavorite(next.some((m: Movie) => m.id === movie.id))
    onFavoriteChange?.()
  }

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} trailer`
  )}`

  const genreNames = getGenreNames(movie.genre_ids)
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "TBA"

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={movie.title}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <img
          className="modal-backdrop-img"
          src={getBackdropUrl(movie.backdrop_path)}
          alt=""
        />

        <div className="modal-body">
          <img
            className="modal-poster"
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
          />
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <p className="modal-meta">
              ⭐ {movie.vote_average?.toFixed(1) ?? "—"} · {releaseYear}
            </p>
            <div className="modal-genres">
              {genreNames.map((g) => (
                <span key={g} className="genre-tag">
                  {g}
                </span>
              ))}
            </div>
            <p className="modal-overview">{movie.overview || "No overview available."}</p>

            <div className="modal-actions">
              <button
                type="button"
                className={`btn-primary ${isFavorite ? "active" : ""}`}
                onClick={handleToggleFavorite}
              >
                <Heart size={16} />
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </button>
              <a
                className="btn-link"
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Youtube size={16} />
                Watch trailer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
