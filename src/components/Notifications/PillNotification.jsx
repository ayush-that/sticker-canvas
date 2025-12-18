import { X, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react";

const typeStyles = {
  success: {
    icon: CheckCircle,
    color: "text-accent",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-400",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
  },
  loading: {
    icon: Loader2,
    color: "text-accent",
    animate: true,
  },
};

export default function PillNotification({
  message,
  type = "info",
  cta,
  onCtaClick,
  onDismiss,
  progress,
}) {
  const { icon: Icon, color, animate } = typeStyles[type] || typeStyles.info;

  return (
    <div
      className="
        flex items-center gap-3 px-4 py-2.5
        rounded-xl glass-elevated
        animate-fade-in min-w-[200px] max-w-[400px]
      "
    >
      <Icon
        size={18}
        className={`${color} ${animate ? "animate-spin" : ""} flex-shrink-0`}
      />
      <span className="text-sm text-text-primary flex-grow">{message}</span>

      {progress !== undefined && (
        <div className="w-16 h-1.5 bg-border-medium rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {cta && (
        <button
          onClick={onCtaClick}
          className="
            px-3 py-1.5 rounded-md
            bg-accent text-text-inverse
            text-sm font-semibold
            hover:bg-accent-hover
            transition-colors duration-fast
          "
        >
          {cta}
        </button>
      )}

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-text-muted hover:text-white hover:bg-surface-hover transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
