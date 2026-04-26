import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon: Icon, color = '#6366f1', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass card-3d p-6 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, color }}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold" style={{ color: 'var(--text)' }}>
          {value}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </motion.div>
  )
}
