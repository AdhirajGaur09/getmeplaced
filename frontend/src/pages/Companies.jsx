import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Building2, ChevronRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import MeshBackground from '../components/3d/MeshBackground'
import Input from '../components/ui/Input'
import api from '../services/api'

// Company brand colors for visual variety
const COMPANY_META = {
  Google:    { color: '#4285f4', emoji: '🔵' },
  Amazon:    { color: '#ff9900', emoji: '📦' },
  Microsoft: { color: '#00a4ef', emoji: '🪟' },
  Meta:      { color: '#0866ff', emoji: '📘' },
  Apple:     { color: '#555555', emoji: '🍎' },
  Netflix:   { color: '#e50914', emoji: '🎬' },
  Flipkart:  { color: '#2874f0', emoji: '🛒' },
  Uber:      { color: '#000000', emoji: '🚗' },
  default:   { color: '#6366f1', emoji: '🏢' },
}

function CompanyCard({ company, count, onClick, delay }) {
  const meta = COMPANY_META[company] || COMPANY_META.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="glass card-3d p-6 cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${meta.color}15` }}
          >
            {meta.emoji}
          </div>
          <div>
            <h3 className="font-display font-semibold" style={{ color: 'var(--text)' }}>
              {company}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {count} question{count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
          style={{ color: 'var(--brand)' }}
        />
      </div>

      {/* Color accent bar */}
      <div
        className="mt-4 h-1 rounded-full opacity-40"
        style={{ background: `linear-gradient(90deg, ${meta.color}, transparent)` }}
      />
    </motion.div>
  )
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [counts, setCounts] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/questions/companies'),
      api.get('/questions/', { params: { limit: 100 } }),
    ]).then(([companiesRes, questionsRes]) => {
      setCompanies(companiesRes.data)
      const c = {}
      questionsRes.data.forEach(q => { c[q.company] = (c[q.company] || 0) + 1 })
      setCounts(c)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="noise min-h-screen">
      <MeshBackground />
      <Navbar />

      <main className="pt-24 pb-16 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text)' }}>
            Company-wise Questions
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Real interview questions asked by top tech companies
          </p>
        </motion.div>

        <div className="mb-6 max-w-sm">
          <Input
            icon={Search}
            placeholder="Search company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p>No companies found. Seed some questions first!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((company, i) => (
              <CompanyCard
                key={company}
                company={company}
                count={counts[company] || 0}
                delay={i * 0.05}
                onClick={() => navigate(`/questions?company=${company}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
