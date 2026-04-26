import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('gmp-auth')
    if (raw) {
      const { state } = JSON.parse(raw)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
  } catch (_) {}
  return config
})

// On 401 → clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gmp-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
