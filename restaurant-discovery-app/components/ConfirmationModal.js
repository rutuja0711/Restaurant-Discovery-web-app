export default function ConfirmationModal({ open, title, message, onClose, onSecondaryAction, secondaryLabel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-dark/50">
      <div className="max-w-[400px] rounded-[20px] bg-white px-8 py-9 text-center shadow-card-lg">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-success text-[28px] text-white">
          ✓
        </div>
        <p className="m-0 mb-1.5 text-xs tracking-wider text-text-muted uppercase">Success</p>
        <h2>{title}</h2>
        <p className="my-2 mb-5 text-sm text-text-muted">{message}</p>
        <div className="flex flex-col gap-2.5">
          {onSecondaryAction && (
            <button className="cursor-pointer rounded-[10px] border-none bg-forest px-3 py-3 font-semibold text-white" onClick={onSecondaryAction}>
              {secondaryLabel}
            </button>
          )}
          <button className="cursor-pointer border-none bg-transparent px-1.5 py-1.5 text-text-muted" onClick={onClose}>
            Done for now
          </button>
        </div>
      </div>
    </div>
  );
}
