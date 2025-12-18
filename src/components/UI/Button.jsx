import React from 'react';

const variants = {
  primary: 'bg-accent text-text-inverse hover:bg-accent-hover hover:shadow-glow',
  secondary: 'bg-surface text-text-secondary border border-border-medium hover:bg-surface-hover hover:text-white',
  ghost: 'text-text-secondary hover:bg-surface-hover hover:text-white',
  danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-md
        transition-all duration-fast
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
}
