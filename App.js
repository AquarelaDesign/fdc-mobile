import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Error: timeout of',
])

export { default } from './src/routes'