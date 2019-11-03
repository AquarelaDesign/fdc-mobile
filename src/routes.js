import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Login from './pages/Login'
import MainMenu from './pages/MainMenu'
import Passagens from './pages/Passagens'

const Routes = createAppContainer(
   createSwitchNavigator({
      Login,
      MainMenu,
      Passagens,
   })
)

export default Routes