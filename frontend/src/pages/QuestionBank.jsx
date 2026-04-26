import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import MeshBackground from '../components/3d/MeshBackground'
import Button from '../components/ui/Button'
import api from '../services/api'

const DIFFICULTIES = ['easy', 'medium', 'hard']
const TYPES = ['DSA', 'System Design', 'Behavioral', 'CS Fundamentals']

function QuestionCard({ q, delay }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-5 cursor-pointer transition-all"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className={`badge-${q.difficulty}`}>{q.difficulty}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
              {q.question_type}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{q.company}</span>
          </div>
          <h3 className="font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>
            {q.title}
          </h3>
          {q.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {q.tags.map(t => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <hr className="my-4" style={{ borderColor: 'var(--border)' }} />
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              {q.description}
            </p>

            {q.hints.length > 0 && (
              <div className="glass p-3 rounded-lg">
                <p className="text-xs font-medium flex items-center gap-1 mb-2" style={{ color: 'var(--brand)' }}>
                  <Lightbulb size={12} /> Hints
                </p>
                {q.hints.map((h, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    {i + 1}. {h}
                  </p>
                ))}
              </div>
            )}

            {q.solution_approach && (
              <div className="mt-3 p-3 rounded-lg font-mono text-xs" style={{ background: 'var(--bg-card)', color: 'var(--text)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--brand)' }}>Approach</p>
                {q.solution_approach}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function QuestionBank() {
  const [params] = useSearchParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    company: params.get('company') || '',
    difficulty: '',
    question_type: '',
  })

  const fetch = async () => {
    setLoading(true)
    try {
      const p = {}
      if (filters.company) p.company = filters.company
      if (filters.difficulty) p.difficulty = filters.difficulty
      if (filters.question_type) p.question_type = filters.question_type
      const { data } = await api.get('/questions/', { params: p })
      setQuestions(data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { fetch() }, [filters])

  const setFilter = (k, v) =>
    setFilters(f => ({ ...f, [k]: f[k] === v ? '' : v }))

  return (
    <div className="noise min-h-screen">
      <MeshBackground />
      <Navbar />

      <main className="pt-24 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text)' }}>
            Question Bank
            {filters.company && <span className="gradient-text ml-2">— {filters.company}</span>}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {questions.length} question{questions.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        {/* Filters */}
        <div className="glass p-4 mb-6 flex flex-wrap gap-3 items-center">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setFilter('difficulty', d)}
                className={`badge-${d} cursor-pointer transition-all ${filters.difficulty === d ? 'ring-2 ring-offset-1' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilter('question_type', t)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  filters.question_type === t
                    ? 'border-brand-500 text-brand-500 bg-brand-500/10'
                    : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {(filters.difficulty || filters.question_type || filters.company) && (
            <button
              onClick={() => setFilters({ company: '', difficulty: '', question_type: '' })}
              className="text-xs ml-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              Clear filters ×
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => (
              <QuestionCard key={q.id} q={q} delay={i * 0.03} />
            ))}
            {questions.length === 0 && (
              <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
                No questions found for these filters.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
