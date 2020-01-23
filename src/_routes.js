import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import Components from './drawer/components'

import Login from './pages/Login'
import Home from './pages/Home'
import Browser from './pages/Browser'
import ListaPlacas from './pages/ListaPlacas'

import Passagem from './pages/Passagens/Passagens'
import Passagem1 from './pages/Passagens/Passagem'
import Infopass from './pages/Passagens/Info'

import Etiqueta from './pages/Etiquetas/Etiquetas'
import Infoetq from './pages/Etiquetas/Info'

import Km from './pages/Km/Km'

import Promocoes from './pages/Promocoes/Promocoes'
import InfoPromo from './pages/Promocoes/Info'

import Outros from './pages/Outros/Outros'
import Mensagens from './pages/Outros/Mensagens'
import ConsultaPJ from './pages/Outros/ConsultaPJ'
import FAQ from './pages/Outros/FAQ'
import Informacao from './pages/Outros/Informacao'

import Indicadores from './pages/Indicadores/Indicadores'
import Recebimentos from './pages/Indicadores/Recebimentos'
import Documentos from './pages/Indicadores/Documentos'


const routes = {
  Login: {
    path: '/login',
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'locked-closed',
      // drawerIcon: <Icon name="lock" size={20} color="#7159c1" />,
      headerShown: false,
    }),
  },
  Home: {
    path: '/home',
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="home" size={20} color="#7159c1" />,
      // title: 'Home',
      // headerTransparent: true,
      headerShown: false,
    }),
  },
  ListaPlacas: {
    path: '/listaPlacas',
    screen: ListaPlacas,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Passagem: {
    path: '/passagem',
    screen: Passagem,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Passagem1: {
    path: '/passagem1',
    screen: Passagem1,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Infopass: {
    path: '/infopass',
    screen: Infopass,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Etiqueta: {
    path: '/etiqueta',
    screen: Etiqueta,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Infoetq: {
    path: '/infoetq',
    screen: Infoetq,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Km: {
    path: '/km',
    screen: Km,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Promocoes: {
    path: '/promocoes',
    screen: Promocoes,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  InfoPromo: {
    path: '/infopromo',
    screen: InfoPromo,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Outros: {
    path: '/outros',
    screen: Outros,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Mensagens: {
    path: '/mensagens',
    screen: Mensagens,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  ConsultaPJ: {
    path: '/consultapj',
    screen: ConsultaPJ,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  FAQ: {
    path: '/faq',
    screen: FAQ,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Informacao: {
    path: '/informacao',
    screen: Informacao,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Indicadores: {
    path: '/indicadores',
    screen: Indicadores,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="bar-chart" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Recebimentos: {
    path: '/recebimentos',
    screen: Recebimentos,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="calculator" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Documentos: {
    path: '/documentos',
    screen: Documentos,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="file" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Components: {
    path: '/components',
    screen: Components,
  },
  Browser: {
    path: '/browser',
    screen: Browser,
  },
}

export default routes