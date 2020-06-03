import { AsyncStorage } from 'react-native'
import axios from 'axios'
import publicIP from 'react-native-public-ip'

const querystring = require('querystring')

const oapi = axios.create({
  baseURL: 'http://siare31.procyon.com.br:3125/cgi-bin/siarewebfdc.pl/wficha',
  timeout: 5000,
})

let wIP = '0.0.0.0'

publicIP().then(ip => {
  wIP = ip
})
.catch(error => {
})

oapi.interceptors.request.use(async config => {

  AsyncStorage.getItem('email').then(Email => {
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

      config.params = querystring.stringify({
        widtrans: `${codemp}|${codfil}|9999|${Email}`,
        wip: wIP,
        wseqaba: 0,
      })
    })
  })
  // console.log('config', config)
  return config
})

oapi.interceptors.response.use((response) => {
  return response
},(error) => {
  if (error.response !== undefined) {
    if (error.response.status === 401) {
      const requestConfig = error.config
      return axios(requestConfig)
    }
  }
  return Promise.reject(error)
})

export default oapi
