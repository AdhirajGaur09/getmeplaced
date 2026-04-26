import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, Cell,
} from 'recharts'
import { Flame, Target, BookOpen, Trophy, TrendingUp } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import MeshBackground from '../components/3d/MeshBackground'
import StatCard from '../components/ui/StatCard'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6']

// Custom tooltip style
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 text-xs">
        <p style={{ color: 'var(--text-muted)' }}>Session {label}</p>
        <p style={{ color: 'var(--brand)' }} className="font-bold">{payload[0].value}/10</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="noise min-h-screen">
      <MeshBackground />
      <Navbar />

      <main className="pt-24 pb-16 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text)' }}>
            Good {getGreeting()},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Here's your interview prep progress at a glance.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Questions Done" value={user?.total_questions_attempted ?? 0} icon={BookOpen} color="#6366f1" delay={0.1} />
          <StatCard label="Mock Sessions" value={user?.total_mock_sessions ?? 0} icon={Target} color="#ec4899" delay={0.2} />
          <StatCard label="Day Streak" value={`${user?.streak_days ?? 0}🔥`} icon={Flame} color="#f59e0b" delay={0.3} />
          <StatCard label="Avg Score" value={stats ? `${stats.avg_overall_score}/10` : '—'} icon={Trophy} color="#14b8a6" delay={0.4} />
        </div>

        {/* Charts row */}
        {!loading && stats && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Score trend */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="glass p-6"
            >
              <h2 className="font-display font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <TrendingUp size={16} style={{ color: 'var(--brand)' }} />
                Score Trend (last 7 sessions)
              </h2>
              {stats.score_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.score_trend}>
                    <XAxis dataKey="session" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="var(--brand)" strokeWidth={2.5} dot={{ fill: 'var(--brand)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState text="Complete mock sessions to see your score trend" />
              )}
            </motion.div>

            {/* Topic performance radar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="glass p-6"
            >
              <h2 className="font-display font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Topic Performance
              </h2>
              {stats.topic_performance.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={stats.topic_performance}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Radar dataKey="avg_score" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState text="Attempt questions across topics to see radar" />
              )}
            </motion.div>
          </div>
        )}

        {/* Weak topics */}
        {user?.weak_topics?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="glass p-6"
          >
            <h2 className="font-display font-semibold mb-4" style={{ color: 'var(--text)' }}>
              💡 Focus Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.weak_topics.map(t => (
                <span key={t} className="badge-medium">{t}</span>
              ))}
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          </div>
        )}
      </main>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
      {text}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
