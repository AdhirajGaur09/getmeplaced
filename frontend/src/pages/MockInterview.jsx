import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Send, ChevronRight, Trophy, RotateCcw, Mic } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import MeshBackground from '../components/3d/MeshBackground'
import Button from '../components/ui/Button'
import api from '../services/api'

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [company, setCompany] = useState('')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [companies, setCompanies] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/questions/companies').then(r => setCompanies(r.data))
    api.get('/questions/topics').then(r => setTopics(r.data))
  }, [])

  const start = async () => {
    setLoading(true)
    try {
      const body = { num_questions: count }
      if (company) body.company_focus = company
      if (topic) body.topic_focus = topic
      const { data } = await api.post('/mock/start', body)
      onStart(data)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to start session')
    } finally {
      setLoading(false)
    }
  }

  const selectCls = "w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass max-w-lg mx-auto p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
          <Mic size={28} style={{ color: 'var(--brand)' }} />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
          Start Mock Interview
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Get AI-scored questions and instant feedback
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
            Company Focus (optional)
          </label>
          <select value={company} onChange={e => setCompany(e.target.value)}
            className={selectCls} style={{ background: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
            <option value="">All companies</option>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
            Topic Focus (optional)
          </label>
          <select value={topic} onChange={e => setTopic(e.target.value)}
            className={selectCls} style={{ background: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
            <option value="">All topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
            Number of Questions: <span style={{ color: 'var(--brand)' }}>{count}</span>
          </label>
          <input type="range" min={3} max={10} value={count} onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-brand-500" />
        </div>

        <Button size="lg" loading={loading} onClick={start} className="mt-2 w-full" icon={ChevronRight}>
          Start Session
        </Button>
      </div>
    </motion.div>
  )
}

// ── Question Screen ───────────────────────────────────────────────────────────
function QuestionScreen({ session, questions, onAnswer, currentIdx }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    setAnswer('')
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [currentIdx])

  const submit = async () => {
    if (!answer.trim()) { toast.error('Write something first!'); return }
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const q = questions[currentIdx]
      const result = await api.post('/mock/answer', {
        session_id: session.id,
        question_id: q.id,
        user_answer: answer,
        time_taken_seconds: elapsed,
      })
      onAnswer(result.data)
    } catch (e) {
      toast.error('Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const q = questions[currentIdx]
  const progress = ((currentIdx) / questions.length) * 100

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <motion.div
      key={currentIdx}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-3xl mx-auto"
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span className="flex items-center gap-1">
            <Timer size={12} /> {fmt(elapsed)}
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full bg-brand-500"
            initial={{ width: `${(currentIdx / questions.length) * 100}%` }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="glass p-6 mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge-${q.difficulty}`}>{q.difficulty}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
            {q.question_type}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{q.company} · {q.topic}</span>
        </div>
        <h2 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--text)' }}>
          {q.title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {q.description}
        </p>
      </div>

      {/* Answer box */}
      <div className="glass p-4">
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>
          Your Answer
        </label>
        <textarea
          rows={6}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer here... Be detailed. Include examples and explain your thought process."
          className="w-full text-sm rounded-lg p-3 resize-none outline-none border focus:border-brand-500 transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text)', borderColor: 'var(--border)' }}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {answer.split(/\s+/).filter(Boolean).length} words
          </span>
          <Button onClick={submit} loading={submitting} icon={Send}>
            Submit Answer
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Feedback Screen ───────────────────────────────────────────────────────────
function FeedbackScreen({ result, onNext, isLast }) {
  const score = result.score
  const color = score >= 7 ? '#10b981' : score >= 4 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass max-w-2xl mx-auto p-8 text-center"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-display font-bold"
        style={{ background: `${color}15`, color, border: `2px solid ${color}30` }}
      >
        {score}/10
      </div>
      <h2 className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--text)' }}>
        {score >= 7 ? '🎉 Great answer!' : score >= 4 ? '👍 Decent attempt' : '💪 Keep practicing'}
      </h2>
      <p className="text-sm leading-relaxed mb-6 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
        {result.ai_feedback}
      </p>
      <Button onClick={onNext} icon={isLast ? Trophy : ChevronRight}>
        {isLast ? 'See Results' : 'Next Question'}
      </Button>
    </motion.div>
  )
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ session, attempts, onRestart }) {
  const avg = attempts.length
    ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1)
    : 0
  const totalTime = attempts.reduce((s, a) => s + a.time_taken_seconds, 0)
  const fmt = s => `${Math.floor(s / 60)}m ${s % 60}s`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass max-w-2xl mx-auto p-8 text-center"
    >
      <Trophy size={48} className="mx-auto mb-4" style={{ color: '#f59e0b' }} />
      <h2 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text)' }}>
        Session Complete!
      </h2>
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
        You answered {attempts.length} questions in {fmt(totalTime)}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Avg Score', value: `${avg}/10` },
          { label: 'Questions', value: attempts.length },
          { label: 'Time', value: fmt(totalTime) },
        ].map(({ label, value }) => (
          <div key={label} className="glass p-4">
            <p className="font-display font-bold text-2xl" style={{ color: 'var(--brand)' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Per-question breakdown */}
      <div className="text-left flex flex-col gap-2 mb-8">
        {attempts.map((a, i) => {
          const color = a.score >= 7 ? '#10b981' : a.score >= 4 ? '#f59e0b' : '#ef4444'
          return (
            <div key={i} className="flex items-center justify-between glass p-3">
              <span className="text-sm" style={{ color: 'var(--text)' }}>Question {i + 1}</span>
              <span className="text-sm font-bold" style={{ color }}>{a.score}/10</span>
            </div>
          )
        })}
      </div>

      <Button onClick={onRestart} icon={RotateCcw}>Start New Session</Button>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MockInterview() {
  const [phase, setPhase] = useState('setup')   // setup | question | feedback | results
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [attempts, setAttempts] = useState([])
  const [lastResult, setLastResult] = useState(null)

  const handleStart = async (sessionData) => {
    // fetch actual question objects
    try {
      const qs = await Promise.all(
        sessionData.questions.map(id => api.get(`/questions/${id}`).then(r => r.data))
      )
      setSession(sessionData)
      setQuestions(qs)
      setCurrentIdx(0)
      setAttempts([])
      setPhase('question')
    } catch {
      toast.error('Could not load questions')
    }
  }

  const handleAnswer = (result) => {
    const newAttempts = [...attempts, result]
    setAttempts(newAttempts)
    setLastResult(result)
    setPhase('feedback')
  }

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setPhase('results')
    } else {
      setCurrentIdx(i => i + 1)
      setPhase('question')
    }
  }

  const restart = () => {
    setPhase('setup')
    setSession(null)
    setQuestions([])
    setCurrentIdx(0)
    setAttempts([])
    setLastResult(null)
  }

  return (
    <div className="noise min-h-screen">
      <MeshBackground />
      <Navbar />

      <main className="pt-24 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text)' }}>
            <span className="gradient-text">AI</span> Mock Interview
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Answer, get scored, and improve — one question at a time.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'setup' && <SetupScreen key="setup" onStart={handleStart} />}
          {phase === 'question' && (
            <QuestionScreen
              key={`q-${currentIdx}`}
              session={session}
              questions={questions}
              currentIdx={currentIdx}
              onAnswer={handleAnswer}
            />
          )}
          {phase === 'feedback' && (
            <FeedbackScreen
              key="feedback"
              result={lastResult}
              onNext={handleNext}
              isLast={currentIdx + 1 >= questions.length}
            />
          )}
          {phase === 'results' && (
            <ResultsScreen key="results" session={session} attempts={attempts} onRestart={restart} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
