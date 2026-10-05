import { GENRES } from "../data/genres"

type FilterBarProps = {
  genre: string
  onGenreChange: (g: string) => void
  sort: string
  onSortChange: (s: string) => void
  view: "grid" | "list"
  onViewChange: (v: "grid" | "list") => void
}

export default function FilterBar({
  genre,
  onGenreChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: FilterBarProps) {
  const entries = Object.entries(GENRES) as [string, string][]

  return (
    <div className="filter-bar">
      <div className="genre-pills">
        <button
          type="button"
          className={`pill ${genre === "" ? "active" : ""}`}
          onClick={() => onGenreChange("")}
        >
          All
        </button>
        {entries.map(([id, name]) => (
          <button
            type="button"
            key={id}
            className={`pill ${genre === id ? "active" : ""}`}
            onClick={() => onGenreChange(id)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="filter-controls">
        <label className="sort-label">
          Sort by:
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="popularity">Popularity</option>
            <option value="vote_average">Rating</option>
            <option value="release_date">Release date</option>
            <option value="title">Title</option>
          </select>
        </label>

        <div className="view-toggle">
          <button
            type="button"
            className={view === "grid" ? "active" : ""}
            onClick={() => onViewChange("grid")}
          >
            Grid
          </button>
          <button
            type="button"
            className={view === "list" ? "active" : ""}
            onClick={() => onViewChange("list")}
          >
            List
          </button>
        </div>
      </div>
    </div>
  )
}
