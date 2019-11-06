/**
 * Globais utilizados pelo sistema
 */
import { AsyncStorage } from 'react-native'
import moment from "moment"
import 'moment/locale/pt-br'
import { Promise } from 'core-js'

export const getOficina = () => {
  try {
    const oficina = AsyncStorage.getItem('oficina')
    if (oficina !== undefined && oficina._d == undefined) {
      JSON.parse(oficina)
    } 
  }
  catch (e) {
    console.log('2', e)
  }
}
export const getEmail = () => AsyncStorage.getItem('email')

// Período do Mês
moment.locale('pt-BR')
export const dataInicial = moment().startOf('month').format('L');
export const dataFinal = moment().endOf('month').format('L');

// Últimos 30 dias
// export const dataInicial = moment().subtract(30, 'days').format('L');
// export const dataFinal   = moment().format('L');
