import { AsyncStorage } from 'react-native'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://168.194.69.79:3003',
  timeout: 15000,
})

api.interceptors.request.use(async config => {

  const wIP = '192.168.50.138'
  AsyncStorage.getItem('email').then(Email => {
    AsyncStorage.getItem('token').then(Token => {

      if (Token) {
        // config.headers.Authorization = `Bearer ${token}`;
        config.headers.Authorization = `${Token}`;
      }
    
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
        // console.log('api_oficina', Oficina)
      })
      // console.log('api_token', Token)
    })
    // console.log('api_email', Email)
  })

  // let Oficina = ''
  // if (oficina !== undefined) {
  //   Oficina = JSON.parse(oficina)
  // }

  // console.log('config', config)
  return config
})

export default api
