import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="app-layout not-found">
      <h1>404</h1>
      <p>We couldn't find that page.</p>
      <button className="btn-primary" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  )
}
