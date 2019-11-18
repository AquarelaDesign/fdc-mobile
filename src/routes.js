import React, { useState } from 'react'
import { Dimensions, View, Image, ScrollView } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'

import SafeAreaView from 'react-native-safe-area-view'
import Icon from 'react-native-vector-icons/FontAwesome'

import AppLoading from './components/AppLoading'

import Components from './drawer/components'
import Login from './pages/Login'
import Home from './pages/Home'
import Passagens from './pages/Passagens'
import Passagem from './pages/Passagens/Passagens'

import Indicadores from './pages/Indicadores'
import Recebimentos from './pages/Recebimentos'
import Documentos from './pages/Documentos'

const WINDOW_WIDTH = Dimensions.get('window').width

const CustomDrawerContentComponent = props => (
  <View style={{ flex: 1, backgroundColor: '#43484d' }}>
    <View
      style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}
    >
      <Image
        source={require('./assets/logo.png')}
        style={{ width: Math.min(WINDOW_WIDTH * 0.57, 200) }}
        resizeMode="contain"
      />
    </View>
    <ScrollView>
    <SafeAreaView 
      style={{ flex: 1, marginLeft: 10 }}
      forceInset={{ top: 'always', horizontal: 'never' }}
      >
      <DrawerItems {...props} />
    </SafeAreaView>
    </ScrollView>
  </View>
)

const Routes = createAppContainer(
  createDrawerNavigator(
    {
      Login: {
        path: '/login',
        screen: Login,
        navigationOptions: ({navigation}) => ({
          drawerLabel: () => null,
          drawerLockMode: 'locked-closed',
          // drawerIcon: <Icon name="lock" size={20} color="#7159c1" />,
        }),
      },
      Home: {
        path: '/home',
        screen: Home,
        navigationOptions: ({navigation}) => ({
          drawerLockMode: 'unlocked',
          drawerIcon: <Icon name="home" size={20} color="#7159c1" />,
        }),
      },
      Passagens: {
        path: '/passagens',
        screen: Passagens,
        navigationOptions: ({navigation}) => ({
          drawerLockMode: 'unlocked',
          drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
        }),
      },
      Passagem: {
        path: '/passagem',
        screen: Passagem,
        navigationOptions: ({navigation}) => ({
          drawerLabel: () => null,
          drawerLockMode: 'unlocked',
          // drawerIcon: <Icon name="list-alt" size={20} color="#7159c1" />,
        }),
      },
      Indicadores: {
        path: '/indicadores',
        screen: Indicadores,
        navigationOptions: ({navigation}) => ({
          drawerLockMode: 'unlocked',
          drawerIcon: <Icon name="bar-chart" size={20} color="#7159c1" />,
        }),
      },
      Recebimentos: {
        path: '/recebimentos',
        screen: Recebimentos,
        navigationOptions: ({navigation}) => ({
          drawerLockMode: 'unlocked',
          drawerIcon: <Icon name="calculator" size={20} color="#7159c1" />,
        }),
      },
      Documentos: {
        path: '/documentos',
        screen: Documentos,
        navigationOptions: ({navigation}) => ({
          drawerLockMode: 'unlocked',
          drawerIcon: <Icon name="file" size={20} color="#7159c1" />,
        }),
      },
      Components: {
        path: '/components',
        screen: Components,
      },
    },
    {
      initialRouteName: 'Login',
      contentOptions: {
        activeTintColor: '#548ff7',
        activeBackgroundColor: 'transparent',
        inactiveTintColor: '#ffffff',
        inactiveBackgroundColor: 'transparent',
        labelStyle: {
          fontSize: 15,
          marginLeft: 0,
        },
      },
      drawerWidth: Math.min(WINDOW_WIDTH * 0.8, 300),
      contentComponent: CustomDrawerContentComponent,
    }
  )
)

export default () => {
  const [isReady, setIsReady] = useState(false)

  const loadAssetsAsync = async () => {
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadAssetsAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  }

  return <Routes />
}
