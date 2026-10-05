import { Movie } from "../types"

type MovieModalProps = {
  movie: Movie
  onClose: () => void
  onFavoriteChange?: () => void
}

export default function MovieModal({ onClose }: MovieModalProps) {
  return <div onClick={onClose}>MovieModal stub</div>
}
