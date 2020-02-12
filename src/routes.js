import React, { useState } from 'react'
import { Animated, Dimensions, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'
import { Ionicons } from '@expo/vector-icons'
import SafeAreaView from 'react-native-safe-area-view'
import Lottie from 'lottie-react-native'

import AppLoading from './components/AppLoading'

import _routes from './_routes'
import loading from './assets/json/car.json'

const WINDOW_WIDTH = Dimensions.get('window').width

const styles = {
  flex: 10,
  position: 'absolute',
  width: '100%',
  height: 50,
  // top: Dimensions.get('window').height - 80,
  padding: 10,
  backgroundColor: 'transparent',
  marginBottom: 30,
}

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
  createStackNavigator(
    _routes,
    {
      headerMode: 'screen',
      headerTransparent: true,
      defaultNavigationOptions: ({ navigation }) => ({
        header:
          <TouchableOpacity
            style={styles}
            onPress={() => navigation.goBack()}>
            <Ionicons
              style={{ color: '#ffffff', width: 50, height: 50 }}
              name={'ios-arrow-dropleft'}
              size={50} />
          </TouchableOpacity>
      }),
    },
    /*
    {
      navigationOptions: {
        headerTransparent: true,
      }
    }
    */
  ),
)

const Menu = createAppContainer(
  createDrawerNavigator(
    _routes,
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
  ),
)

const anima = () => {
  return (
    <Lottie source={anima} autoPlay loop />
  )
}

export default () => {
  const [isReady, setIsReady] = useState(false)

  const loadAssetsAsync = async () => {
  }

  if (!isReady) {
    return (
      <AppLoading
        ref={() => anima}
        startAsync={loadAssetsAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  }

  return <Routes />
}
