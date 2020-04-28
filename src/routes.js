import React, { useState, useEffect } from 'react'

import { 
  Animated, 
  Dimensions, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native'

import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'
import { FontAwesome } from '@expo/vector-icons'
import SafeAreaView from 'react-native-safe-area-view'
import Lottie from 'lottie-react-native'

import { AppLoading } from 'expo'

import _routes from './_routes'
import loading from './assets/json/car-scan.json'

const WINDOW_WIDTH = Dimensions.get('window').width

const CustomDrawerContentComponent = props => (
  <View style={{ flex: 1, backgroundColor: '#27a2b3' }}>
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
        headerForceInset: { top: 'never', bottom: 'never' },
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#218da3",
          height: 35,
        },
  
        headerLeft:
          <TouchableOpacity
            style={styles}
            onPress={() => navigation.goBack()}>
            <FontAwesome
              style={{ color: '#ffffff', width: 40, height: 30 }}
              name={'long-arrow-left'}
              size={30} />
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

const anima = async () => {
  return (
    <Lottie source={loading} autoPlay loop />
  )
}

export default () => {
  const [isReady, setIsReady] = useState(false)

  const _cacheResourcesAsync = async () => {
    const images = [require('./assets/car-loader.gif')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    return Promise.all(cacheImages);
  }

  useEffect(() => {
    // setTimeout(
    //   () =>
    //     this.setState({ align: 'flex-start' }, function() {
    //       this.setState({
    //         alignsecond: true,
    //       });
    //     }),
    //   3000
    // );
    setIsReady(true)
  }, [])

  if (!isReady) {
    return (
      <AppLoading
        startAsync={anima}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    )
  }

  return <Routes />
}

const styles = {
  flex: 1,
  // position: 'absolute',
  width: '100%',
  height: 30,
  padding: 10,
  backgroundColor: 'transparent',
  // marginBottom: 30,
  marginTop: -20,
}
 
