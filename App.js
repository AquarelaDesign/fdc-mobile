import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Error: timeout of',
  "Warning: Can't perform a",
])

export { default } from './src/routes'