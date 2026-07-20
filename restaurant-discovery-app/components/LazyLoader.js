export default function LazyLoader({ message = 'Loading...', fullPage = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullPage ? 'min-h-[50vh] px-6 py-[60px]' : 'py-10'
      }`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative h-11 w-11">
        <div className="absolute inset-0 rounded-full border-[3px] border-forest/15" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-forest" />
      </div>
      <p className="m-0 text-[15px] text-text-muted">{message}</p>
    </div>
  );
}
