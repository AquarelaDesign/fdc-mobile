import { AsyncStorage } from 'react-native'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://168.194.69.79:3003',
  timeout: 5000,
})

api.interceptors.request.use(async config => {
  const wIP = '192.168.50.138'

  AsyncStorage.getItem('email').then(Email => {
    AsyncStorage.getItem('token').then(Token => {
      if (Token) {
        config.headers.Authorization = Token
      }
    })

    AsyncStorage.getItem('oficina').then(Oficina => {
      let codemp = ''
      let codfil = 0
      Oficina = JSON.parse(Oficina)
      if (Oficina !== undefined && Oficina !== null) {
        if (Oficina.codsia !== undefined && Oficina.codsia !== null) {
          codemp = Oficina.codsia.substring(0, 2)
          codfil = parseInt(Oficina.codsia.substring(5, 2))
        } 
      }

      config.params = {
        widtrans: `${codemp}|${codfil}|9999|${email}`,
        wip: wIP,
        wseqaba: 0,
      }
    })
  })

  return config
})

export default api
