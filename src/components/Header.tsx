type HeaderProps = {
  search: string
  onSearch: (value: string) => void
  onlyFavorites: boolean
  onToggleFavorites: () => void
  theme: "dark" | "light"
  onToggleTheme: () => void
  favCount: number
  onOpenApiConfig: () => void
}

export default function Header(_props: HeaderProps) {
  return <header>Header stub</header>
}
