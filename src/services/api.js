import axios from 'axios'
import { getToken } from './auth'
// import { getOficina, getEmail } from '../globais'

const api = axios.create({
  baseURL: 'http://168.194.69.79:3003',
  timeout: 5000,
})

api.interceptors.request.use(async config => {
  const token = getToken()

  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    config.headers.Authorization = token
  }

  return config
})

export default api
