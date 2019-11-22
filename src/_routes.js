import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import Components from './drawer/components'
import Login from './pages/Login'
import Home from './pages/Home'
import Passagens from './pages/Passagens'
import Passagem from './pages/Passagens/Passagens'
import Passagem1 from './pages/Passagens/Passagem'
import Infopass from './pages/Passagens/Info'

import Etiquetas from './pages/Etiquetas'
import Etiqueta from './pages/Etiquetas/Etiquetas'
import Infoetq from './pages/Etiquetas/Info'

import Indicadores from './pages/Indicadores'
import Recebimentos from './pages/Recebimentos'
import Documentos from './pages/Documentos'


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
  Passagens: {
    path: '/passagens',
    screen: Passagens,
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
  Etiquetas: {
    path: '/etiquetas',
    screen: Etiquetas,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
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
}

export default routes