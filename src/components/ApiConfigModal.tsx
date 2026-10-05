import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { getApiKey, setApiKey } from "../utils/storage"

type ApiConfigModalProps = {
  onClose: () => void
}

export default function ApiConfigModal({ onClose }: ApiConfigModalProps) {
  const [key, setKey] = useState(getApiKey())

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSave = () => {
    setApiKey(key)
    onClose()
  }

  const handleClear = () => {
    setApiKey("")
    setKey("")
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal modal-small"
        role="dialog"
        aria-modal="true"
        aria-label="TMDB API Key"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="modal-body">
          <h2>TMDB API Key</h2>
          <p className="modal-help">
            Paste your TMDB v3 API key to load live data. Leave empty to use
            the built-in sample movies.
          </p>
          <input
            type="text"
            className="api-key-input"
            placeholder="your_tmdb_v3_key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
          />

          <div className="modal-actions">
            <button type="button" onClick={handleClear}>
              Clear
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
