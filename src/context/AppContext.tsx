import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react"
import type { Movie, Theme } from "../types"

// one place for the global stuff, so pages dont have to pass theme + favorites around
type State = {
  theme: Theme
  favorites: Movie[]
}

type Action =
  | { type: "SET_THEME" }
  | { type: "TOGGLE_FAVOURITE"; payload: Movie }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" }
    case "TOGGLE_FAVOURITE": {
      const exists = state.favorites.some((m) => m.id === action.payload.id)
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((m) => m.id !== action.payload.id)
          : [...state.favorites, action.payload],
      }
    }
    default:
      return state
  }
}

type AppContextType = {
  theme: Theme
  toggleTheme: () => void
  favorites: Movie[]
  toggleFavorite: (movie: Movie) => void
  isFavorite: (id: number) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// read saved theme on first paint so the page doesnt flash the wrong colors
function readInitialTheme(): Theme {
  const saved = localStorage.getItem("cinegrid_theme")
  return saved === "light" ? "light" : "dark"
}

// pull saved favorites once on mount, be defensive in case the json is junk
function readInitialFavorites(): Movie[] {
  try {
    const raw = localStorage.getItem("cinegrid_favorites")
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    theme: readInitialTheme(),
    favorites: readInitialFavorites(),
  }))

  // keep storage + the html data-theme attribute in sync when theme changes
  useEffect(() => {
    localStorage.setItem("cinegrid_theme", state.theme)
    document.documentElement.setAttribute("data-theme", state.theme)
  }, [state.theme])

  // save favorites so they survive a page reload
  useEffect(() => {
    localStorage.setItem("cinegrid_favorites", JSON.stringify(state.favorites))
  }, [state.favorites])

  const toggleTheme = () => dispatch({ type: "SET_THEME" })
  const toggleFavorite = (movie: Movie) =>
    dispatch({ type: "TOGGLE_FAVOURITE", payload: movie })
  const isFavorite = (id: number) =>
    state.favorites.some((m) => m.id === id)

  return (
    <AppContext.Provider
      value={{
        theme: state.theme,
        toggleTheme,
        favorites: state.favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider")
  return ctx
}
