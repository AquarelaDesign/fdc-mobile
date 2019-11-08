import { AsyncStorage } from 'react-native'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://168.194.69.79:3003',
  timeout: 5000,
})

api.interceptors.request.use(async (config) => {
  const wIP = '192.168.50.138'

  if (config.url.endsWith('busca')) {
    AsyncStorage.getItem('email').then(Email => {
      AsyncStorage.getItem('token').then(Token => {
        if (Token) {
          // config.headers.Authorization = `Bearer ${Token}`;
          config.headers.authorization = Token
          // console.log('config.headers.authorization', config.headers.authorization)
        }
      })

      AsyncStorage.getItem('oficina').then(Oficina => {
        let codemp = ''
        if (Oficina !== undefined) {
          codemp = Oficina.codemp !== undefined ? Oficina.codemp : ''
        }

        config.params = {
          widtrans: `${codemp}|1|1|${Email}`,
          wip: wIP,
          wseqaba: 0,
        }
      })
    })
    // console.log('config', config)
  }

  return config
}, (error) => {
  return Promise.reject(error)
})


api.interceptors.response.use((response) => {
  // console.log('response', response)
  return response
},(error) => {
  if (error.response.status === 401) {     
    const requestConfig = error.config
    return axios(requestConfig)
  }
  return Promise.reject(error)
})


export default api
