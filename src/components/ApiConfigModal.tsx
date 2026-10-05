type ApiConfigModalProps = {
  onClose: () => void
}

export default function ApiConfigModal({ onClose }: ApiConfigModalProps) {
  return <div onClick={onClose}>ApiConfigModal stub</div>
}
