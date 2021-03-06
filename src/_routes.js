import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import Components from './drawer/components'

import Login from './pages/Login'
import Home from './pages/Home'
import Browser from './pages/Browser'
import ListaPlacas from './pages/ListaPlacas'

import Passagens from './pages/Passagens/Passagens'
import Passagem from './pages/Passagens/Passagem'
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
import Etiquetas from './pages/Indicadores/Etiquetas'
import Indica from './pages/Indicadores/Indica'
import Contas from './pages/Indicadores/Contas'
import Recebimentos from './pages/Indicadores/Recebimentos'
import Documentos from './pages/Indicadores/Documentos'

import Menu from './pages/Menu/Menu'
import InfoConfig from './pages/Menu/Info'
import Usuario from './pages/Menu/Usuario'

import NovoUsuario from './pages/Cadastros/NovoUsuario'

const routes = {
  Login: {
    path: '/login',
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'locked-closed',
      headerShown: false,
    }),
  },
  Home: {
    path: '/home',
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="home" size={20} color="#7159c1" />,
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
  Passagens: {
    path: '/passagens',
    screen: Passagens,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Passagem: {
    path: '/passagem',
    screen: Passagem,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Infopass: {
    path: '/infopass',
    screen: Infopass,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Etiqueta: {
    path: '/etiqueta',
    screen: Etiqueta,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Infoetq: {
    path: '/infoetq',
    screen: Infoetq,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Km: {
    path: '/km',
    screen: Km,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Promocoes: {
    path: '/promocoes',
    screen: Promocoes,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  InfoPromo: {
    path: '/infopromo',
    screen: InfoPromo,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Outros: {
    path: '/outros',
    screen: Outros,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Mensagens: {
    path: '/mensagens',
    screen: Mensagens,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  ConsultaPJ: {
    path: '/consultapj',
    screen: ConsultaPJ,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  FAQ: {
    path: '/faq',
    screen: FAQ,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
      headerTransparent: true,
    }),
  },
  Informacao: {
    path: '/informacao',
    screen: Informacao,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: () => null,
      drawerLockMode: 'unlocked',
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
  Etiquetas: {
    path: '/etiquetas',
    screen: Etiquetas,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="tags" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Indica: {
    path: '/indica',
    screen: Indica,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="tags" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Contas: {
    path: '/contas',
    screen: Contas,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="tags" size={20} color="#7159c1" />,
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
  Menu: {
    path: '/menu',
    screen: Menu,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="file" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  InfoConfig: {
    path: '/infoconfig',
    screen: InfoConfig,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="file" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  Usuario: {
    path: '/usuario',
    screen: Usuario,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'unlocked',
      drawerIcon: <Icon name="file" size={20} color="#7159c1" />,
      headerTransparent: true,
    }),
  },
  NovoUsuario: {
    path: '/novousuario',
    screen: NovoUsuario,
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