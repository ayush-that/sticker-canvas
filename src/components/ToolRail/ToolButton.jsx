export default function ToolButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  active = false,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-11 h-11 rounded-[10px]
        flex items-center justify-center
        transition-all duration-fast
        disabled:opacity-50 disabled:cursor-not-allowed
        group relative
        ${
          active
            ? "bg-accent/15 text-accent"
            : "bg-transparent text-[#d0d0d0] hover:bg-surface-hover hover:text-white"
        }
      `}
      title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
      aria-label={label}
    >
      <Icon size={20} />

      <div
        className="
          absolute left-full ml-3 px-2 py-1.5 rounded-md
          bg-elevated text-sm text-white whitespace-nowrap
          opacity-0 pointer-events-none
          group-hover:opacity-100
          transition-opacity duration-fast
          shadow-elevated
          z-50
        "
      >
        <span>{label}</span>
        {shortcut && (
          <span className="ml-2 text-text-muted text-xs">{shortcut}</span>
        )}
      </div>
    </button>
  );
}
