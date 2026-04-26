import clsx from 'clsx'

export default function Input({
  label, type = 'text', value, onChange,
  placeholder = '', error = '', icon: Icon = null,
  className = '', ...rest
}) {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            <Icon size={15} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={clsx(
            'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200',
            'border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
            Icon && 'pl-10',
            error ? 'border-red-500/50' : 'border-[var(--border)]'
          )}
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text)',
          }}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
