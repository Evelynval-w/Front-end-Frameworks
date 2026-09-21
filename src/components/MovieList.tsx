import { Movie } from "../types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
}

const MovieList = ({ movies }: MovieListProps) => {
  if (movies.length === 0) {
    return <p>No movies found.</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        // key so react can tell cards apart when the list changes
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
