import { Link } from "react-router-dom"

export default function AboutPage() {
  return (
    <div className="app-layout">
      <h1>About Movie App</h1>
      <p>Student project for the EPITA Front-End Frameworks course (S5).</p>
      <p>Browse popular movies from TMDB, or use the built-in sample data when no API key is set.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  )
}
