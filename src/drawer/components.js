import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

import HomeTab from '../pages/Home'
import IndicadoresTab from '../pages/Indicadores'
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
    // Android's default option displays tabBars on top, but iOS is bottom
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#e91e63',
      // Android's default showing of icons is false whereas iOS is true
      showIcon: true,
    },
  }
);

// Workaround to avoid crashing when you come back on Components screen
// and you were not on the Buttons tab
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
);
