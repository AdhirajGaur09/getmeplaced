import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Mic, BarChart3, Zap, Shield, Sparkles } from 'lucide-react'
import HeroScene from '../components/3d/HeroScene'
import MeshBackground from '../components/3d/MeshBackground'
import Button from '../components/ui/Button'
import useThemeStore from '../store/themeStore'
import { Sun, Moon } from 'lucide-react'

const FEATURES = [
  {
    icon: Building2,
    title: 'Company-wise Questions',
    desc: 'Browse real interview questions filtered by Google, Amazon, Microsoft, and 50+ companies.',
    color: '#6366f1',
  },
  {
    icon: Mic,
    title: 'AI Mock Interviews',
    desc: 'Practice with timed sessions. Get instant AI feedback and a score for every answer.',
    color: '#ec4899',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    desc: 'Track your weak topics, score trends, streaks, and time-per-question over time.',
    color: '#14b8a6',
  },
]

export default function LandingPage() {
  const { isDark, toggle } = useThemeStore()

  return (
    <div className="noise min-h-screen">
      <MeshBackground />

      {/* Minimal top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        <span className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>
          Get<span className="gradient-text">MePlaced</span>
        </span>
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="w-9 h-9 glass rounded-lg flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-8"
            style={{ color: 'var(--brand)' }}
          >
            <Sparkles size={14} />
            AI-powered interview preparation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display font-bold text-6xl md:text-8xl leading-tight mb-6"
            style={{ color: 'var(--text)' }}
          >
            Crack any{' '}
            <span className="gradient-text">interview</span>
            <br />with confidence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Company-specific questions. AI mock sessions. Real-time feedback.
            Everything you need to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} className="flex-row-reverse">
                Start Preparing Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-display font-bold text-4xl text-center mb-16"
          style={{ color: 'var(--text)' }}
        >
          Everything you need to get placed
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass card-3d p-8"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}15`, color }}
              >
                <Icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--text)' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="glass p-16 rounded-3xl" style={{ border: '1px solid var(--border)' }}>
          <Zap size={40} className="mx-auto mb-6" style={{ color: 'var(--brand)' }} />
          <h2 className="font-display font-bold text-4xl mb-4" style={{ color: 'var(--text)' }}>
            Ready to get placed?
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Join thousands of developers who cracked their dream companies.
          </p>
          <Link to="/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
