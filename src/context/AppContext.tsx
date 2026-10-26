import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react"
import type { Theme } from "../types"

// one place for the global stuff, so pages dont have to pass theme everywhere
type State = {
  theme: Theme
}

type Action = { type: "SET_THEME" }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" }
    default:
      return state
  }
}

type AppContextType = {
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// read saved theme on first paint so the page doesnt flash the wrong colors
function readInitialTheme(): Theme {
  const saved = localStorage.getItem("cinegrid_theme")
  return saved === "light" ? "light" : "dark"
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    theme: readInitialTheme(),
  }))

  // keep storage + the html data-theme attribute in sync when theme changes
  useEffect(() => {
    localStorage.setItem("cinegrid_theme", state.theme)
    document.documentElement.setAttribute("data-theme", state.theme)
  }, [state.theme])

  const toggleTheme = () => dispatch({ type: "SET_THEME" })

  return (
    <AppContext.Provider value={{ theme: state.theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider")
  return ctx
}
