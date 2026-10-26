import { Heart, Moon, Search, Settings, Sun, X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

type HeaderProps = {
  search: string
  onSearch: (value: string) => void
  onlyFavorites: boolean
  onToggleFavorites: () => void
  favCount: number
  onOpenApiConfig: () => void
}

export default function Header({
  search,
  onSearch,
  onlyFavorites,
  onToggleFavorites,
  favCount,
  onOpenApiConfig,
}: HeaderProps) {
  // theme now comes from context so HomePage doesnt have to thread it in
  const { theme, toggleTheme } = useAppContext()

  return (
    <header className="site-header">
      <div className="header-brand">
        <h1 className="brand-badge">🎬 Movie App</h1>
        <nav className="main-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>

      <div className="header-controls">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search movies"
          />
          {search && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => onSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-icon-label ${onlyFavorites ? "active" : ""}`}
          onClick={onToggleFavorites}
          aria-pressed={onlyFavorites}
        >
          <Heart size={16} />
          <span>Favorites</span>
          <span className="count-badge">{favCount}</span>
        </button>

        <button
          type="button"
          className="btn-icon-label"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          type="button"
          className="btn-icon-label"
          onClick={onOpenApiConfig}
        >
          <Settings size={16} />
          <span>API Key</span>
        </button>
      </div>
    </header>
  )
}
