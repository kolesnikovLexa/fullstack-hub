function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="modalOverlay">
      <div className="modal">{children}</div>
    </div>
  )
}

export default Modal
