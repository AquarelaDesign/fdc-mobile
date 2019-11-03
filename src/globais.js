/**
 * Globais utilizados pelo sistema
 */
import { AsyncStorage } from 'react-native'
import moment from "moment"
import 'moment/locale/pt-br'

export const getOficina = () => JSON.parse(AsyncStorage.getItem('@fdc/oficina'))
export const getEmail = () => AsyncStorage.getItem('@fdc/email')

// Período do Mês
moment.locale('pt-BR')
export const dataInicial = moment().startOf('month').format('L');
export const dataFinal   = moment().endOf('month').format('L');

// Últimos 30 dias
// export const dataInicial = moment().subtract(30, 'days').format('L');
// export const dataFinal   = moment().format('L');
