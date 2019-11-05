import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Login from './pages/Login'
import MainMenu from './pages/MainMenu'
import Passagens from './pages/Passagens'
import Indicadores from './pages/Indicadores'
import Documentos from './pages/Documentos'

const Routes = createAppContainer(
   createStackNavigator({
      Login,
      MainMenu: {
         screen: MainMenu,
         navigationOptions: {
            headerTitle: 'Home'
         }
      },
      Passagens: {
         screen: Passagens,
         navigationOptions: {
            headerTitle: 'Passagens'
         }
      },
      Indicadores: {
         screen: Indicadores,
         navigationOptions: {
            headerTitle: 'Indicadores'
         }
      },
      Documentos: {
         screen: Documentos,
         navigationOptions: {
            headerTitle: 'Documentos'
         }
      },
   },{
      /* The header config from HomeScreen is now here */
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#00B2EE',
        },
        headerTintColor: '#007189',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    })
)

export default Routes