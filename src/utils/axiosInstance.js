import axios from 'axios'

const api = axios.create({
baseURL: 'https://book-store1-1-vcmd.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expired - manual refresh required');
    }
    return Promise.reject(error)
  }
)

export default api

