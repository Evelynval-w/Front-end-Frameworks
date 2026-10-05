type FilterBarProps = {
  genre: string
  onGenreChange: (g: string) => void
  sort: string
  onSortChange: (s: string) => void
  view: "grid" | "list"
  onViewChange: (v: "grid" | "list") => void
}

export default function FilterBar(_props: FilterBarProps) {
  return <div>FilterBar stub</div>
}
