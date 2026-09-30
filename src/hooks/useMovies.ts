import { useEffect, useState } from "react"
import { movieService } from "../services/movieService"
import { Movie } from "../types"

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await movieService.fetchMovies({ signal: controller.signal })
        setMovies(data.results)
      } catch (err) {
        // abort is intentional, don't treat it as an error
        if (err instanceof DOMException && err.name === "AbortError") return
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return { movies, isLoading, error }
}
