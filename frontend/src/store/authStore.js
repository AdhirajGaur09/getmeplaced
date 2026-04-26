import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/login', { email, password })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
        const { data: user } = await api.get('/auth/me')
        set({ token: data.access_token, user, isLoading: false })
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/register', { name, email, password })
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
        const { data: user } = await api.get('/auth/me')
        set({ token: data.access_token, user, isLoading: false })
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization']
        set({ token: null, user: null })
      },

      refreshUser: async () => {
        const { data } = await api.get('/auth/me')
        set({ user: data })
      },
    }),
    { name: 'gmp-auth', partialize: (s) => ({ token: s.token }) }
  )
)

export default useAuthStore
