export default function ConfirmationModal({ open, title, message, onClose, onSecondaryAction, secondaryLabel }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-check">✓</div>
        <p className="modal-step">Success</p>
        <h2>{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {onSecondaryAction && (
            <button className="modal-btn-primary" onClick={onSecondaryAction}>{secondaryLabel}</button>
          )}
          <button className="modal-btn-secondary" onClick={onClose}>Done for now</button>
        </div>
      </div>
    </div>
  );
}
