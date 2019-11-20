import { AsyncStorage } from 'react-native'
import axios from 'axios'

const querystring = require('querystring')

const oapi = axios.create({
  baseURL: 'http://siare08.procyon.com.br:3125/cgi-bin/siarewebtt.pl/wficha',
  timeout: 5000,
})

oapi.interceptors.request.use(async config => {
  const wIP = '192.168.50.138'

  AsyncStorage.getItem('email').then(Email => {
    AsyncStorage.getItem('oficina').then(Oficina => {
      let codemp = ''
      if (Oficina !== undefined && Oficina !== null) {
        codemp = Oficina.codemp !== undefined && Oficina.codemp !== null ? Oficina.codemp : ''
      }

      config.params = querystring.stringify({
        widtrans: `${codemp}|1|1|${Email}`,
        wip: wIP,
        wseqaba: 0,
      })
    })
  })

  return config
})

oapi.interceptors.response.use((response) => {
  // console.log('oApi', response)
  return response
},(error) => {
  if (error.response.status === 401)  {     
    const requestConfig = error.config
    return axios(requestConfig)
  }
  return Promise.reject(error)
})

export default oapi
