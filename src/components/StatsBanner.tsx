import { GENRES } from "../data/genres"

type StatsBannerProps = {
  count: number
  avgRating: number
  activeGenre: string
  isLiveApi: boolean
}

export default function StatsBanner({
  count,
  avgRating,
  activeGenre,
  isLiveApi,
}: StatsBannerProps) {
  const genreName = activeGenre
    ? (GENRES as Record<string, string>)[activeGenre] || "Other"
    : "All"

  return (
    <div className="stats-banner">
      <span>
        Results: <strong>{count}</strong>
      </span>
      <span>
        Avg rating: <strong>{avgRating ? avgRating.toFixed(1) : "—"}</strong>
      </span>
      <span>
        Genre: <strong>{genreName}</strong>
      </span>
      <span className={`indicator ${isLiveApi ? "live" : "local"}`}>
        {isLiveApi ? "Live API" : "Local data"}
      </span>
    </div>
  )
}
