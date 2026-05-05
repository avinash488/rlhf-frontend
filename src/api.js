import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const generate = (prompt) => api.post('/generate', { prompt })
export const vote = (data) => api.post('/vote', data)
export const getStats = () => api.get('/stats')
export const exportJsonl = () => `${import.meta.env.VITE_API_URL}/export`