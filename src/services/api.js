import axios from 'axios'
import { getToken } from './auth'
import { getOficina, getEmail } from '../globais'

const api = axios.create({
  baseURL: 'http://168.194.69.79:3003',
  timeout: 5000,
})

api.interceptors.request.use(async config => {
  const token = getToken()
  const email = getEmail()
  const oficina = getOficina()

  const wIP = '192.168.50.138'

  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    config.headers.Authorization = `${token}`
  }

  let codemp = ''
  if (oficina !== undefined) {
    codemp = oficina.codemp !== undefined ? oficina.codemp : ''
  }

  config.params = {
    widtrans: `${codemp}|1|1|${email}`,
    wip: wIP,
    wseqaba: 0,
  }

  return config
})

export default api
