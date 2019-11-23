import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

import HomeTab from '../pages/Home'
import IndicadoresTab from '../pages/Indicadores/Indicadores'
import LoginTab from '../pages/Login'

const Components = createBottomTabNavigator(
  {
    HomeTab: {
      screen: HomeTab,
      path: '/buttons',
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name={focused ? 'home' : 'home-outline'}
            size={30}
            type="material-community"
            color={tintColor}
          />
        ),
      },
    },
    IndicadoresTab: {
      screen: IndicadoresTab,
      path: '/indicadores',
      navigationOptions: {
        tabBarLabel: 'Indicadores',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon 
            name={focused ? 'home' : 'home-outline'}
            size={30} 
            type="material-community"
            color={tintColor} 
          />
        ),
      },
    },
    LoginTab: {
      screen: LoginTab,
      path: '/login',
      navigationOptions: {
        tabBarLabel: 'Login',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon 
            name='logout'
            size={30} 
            type="material-community"
            color={tintColor} 
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'LoginTab',
    animationEnabled: false,
    swipeEnabled: true,
    // A opção padrão do Android exibe tabBars na parte superior, mas o iOS é inferior
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#e91e63',
      // A exibição padrão de ícones do Android é falsa, enquanto o iOS é verdadeiro
      showIcon: true,
    },
  }
)

// Solução alternativa para evitar falhas ao voltar 
// à tela Componentes e você não estava na guia Botões
export default createStackNavigator(
  {
    ComponentsTabs: { screen: Components },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      drawerLabel: 'Components',
      drawerIcon: ({ tintColor }) => (
        <Icon
          name="settings"
          size={30}
          iconStyle={{
            width: 30,
            height: 30,
          }}
          type="material"
          color={tintColor}
        />
      ),
    }
  }
)
