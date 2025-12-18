import { X } from "lucide-react";

export default function FloatingPanel({
  title,
  children,
  onClose,
  position = "bottom-right",
  width = 320,
  className = "",
}) {
  const positionClasses = {
    "bottom-right": "right-6 bottom-6",
    "bottom-left": "left-24 bottom-6",
    "top-right": "right-6 top-20",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={`
        fixed z-40 rounded-lg overflow-hidden
        glass-elevated animate-fade-in
        ${positionClasses[position]}
        ${className}
      `}
      style={{ width }}
    >
      {title && (
        <header className="flex justify-between items-center px-4 py-3 border-b border-border-subtle">
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-text-muted hover:text-white hover:bg-surface-hover transition-colors duration-fast"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          )}
        </header>
      )}
      <div className="p-3 max-h-[400px] overflow-y-auto">{children}</div>
    </div>
  );
}
