import { useState } from "react";
import { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [isFavourite, setIsFavourite] = useState(false); // each card gets its own copy of this

  const year = movie.release_date ? movie.release_date.substring(0, 4) : "TBA";
  const rating = movie.vote_average.toFixed(1);

  return (
    <article
      className="movie-card"
      tabIndex={0}
      aria-label={`${movie.title} (${year})`}
      onClick={() => onClick?.(movie)}
    >
      <div className="poster-wrapper">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="poster-img"
          loading="lazy"
        />
        <div className="poster-overlay">
          <span className="rating-badge">{rating}</span>
          <button
            className={`favorite-btn ${isFavourite ? "is-favorite" : ""}`}
            aria-label={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
            onClick={(e) => {
              e.stopPropagation(); // don't also trigger the card's onClick
              setIsFavourite(!isFavourite);
            }}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-card-info">
        <h2 className="movie-card-title">{movie.title}</h2>
        <div className="movie-card-meta">
          <span>{year}</span>
          <span>{movie.vote_count.toLocaleString()} votes</span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
