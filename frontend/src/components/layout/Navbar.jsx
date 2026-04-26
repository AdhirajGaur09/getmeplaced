import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, LogOut, LayoutDashboard, Building2, Mic } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/companies',  label: 'Companies',   icon: Building2 },
  { to: '/mock',       label: 'Mock Interview', icon: Mic },
]

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { isDark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-display font-bold text-sm shadow-lg">
            G
          </div>
          <span className="font-display font-semibold text-lg" style={{ color: 'var(--text)' }}>
            Get<span className="gradient-text">MePlaced</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to)
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'hover:bg-white/5'
                }`}
                style={{ color: active ? 'var(--brand)' : 'var(--text-muted)' }}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'var(--text-muted)' }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Avatar */}
          {user && (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                style={{ background: user.avatar_color }}
              >
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text)' }}>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all"
                style={{ color: 'var(--text-muted)' }}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
