import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Login from './pages/Login'
import MainMenu from './pages/MainMenu'
import Passagens from './pages/Passagens'
import Indicadores from './pages/Indicadores'

const Routes = createAppContainer(
   createSwitchNavigator({
      Login,
      MainMenu,
      Passagens,
      Indicadores,
   })
)

export default Routes