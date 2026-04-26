import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import MeshBackground from '../components/3d/MeshBackground'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import useAuthStore from '../store/authStore'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success("You're in! Let's get you placed 🚀")
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="noise min-h-screen flex items-center justify-center px-4">
      <MeshBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
        className="glass w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4 shadow-lg shadow-brand-500/25">
            G
          </div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>
            Create your account
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Start your interview prep journey today
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Full Name" name="name" icon={User} placeholder="John Doe" value={form.name} onChange={handle} required />
          <Input label="Email" name="email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={handle} required />
          <Input label="Password" name="password" type="password" icon={Lock} placeholder="Min. 6 characters" value={form.password} onChange={handle} required />

          <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="mt-2 flex-row-reverse w-full">
            Get Started
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--brand)' }}>
            Sign in →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
