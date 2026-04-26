import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import useAuthStore from './store/authStore'
import useThemeStore from './store/themeStore'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import Dashboard      from './pages/Dashboard'
import Companies      from './pages/Companies'
import QuestionBank   from './pages/QuestionBank'
import MockInterview  from './pages/MockInterview'

function RequireAuth({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { init } = useThemeStore()

  useEffect(() => { init() }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontFamily: 'Cabinet Grotesk, sans-serif',
            fontSize: '13px',
          },
        }}
      />

      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />

        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/companies" element={<RequireAuth><Companies /></RequireAuth>} />
        <Route path="/questions" element={<RequireAuth><QuestionBank /></RequireAuth>} />
        <Route path="/mock"      element={<RequireAuth><MockInterview /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
