
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitastic_token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

// Error ko saaf message me badalta hai (status code ke saath)
export function errorText(err) {
  if (err.response) {
    return `${err.response.data?.message || 'Request failed'} (${err.response.status})`
  }
  return 'Server se connect nahi ho pa raha. Backend chal raha hai?'
}

export default api