import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  disabled = false, loading = false,
  className = '', icon: Icon = null,
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 select-none'

  const variants = {
    primary:  'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40',
    ghost:    'hover:bg-white/5 border border-transparent hover:border-[var(--border)]',
    danger:   'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
    outline:  'border border-[var(--border)] hover:border-brand-500/50 hover:bg-brand-500/5',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={clsx(base, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : Icon ? (
        <Icon size={14} />
      ) : null}
      {children}
    </motion.button>
  )
}
